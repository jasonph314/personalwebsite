import json
import os
import re
from datetime import datetime
from pathlib import Path

from flask import Flask, render_template, send_from_directory, abort
from mistletoe import Document
from mistletoe.span_token import SpanToken
from mistletoe.block_token import BlockToken, tokenize
from mistletoe.html_renderer import HTMLRenderer
import html as html_mod

app = Flask(__name__)

# ---------------------------------------------------------------------------
# Mistletoe Extensions (inspired by CAT-SOOP's markdown.py)
# ---------------------------------------------------------------------------

LANG_LIST = [
    "python", "py", "javascript", "js", "typescript", "ts", "bash", "sh",
    "zsh", "c", "cpp", "c++", "java", "rust", "rs", "go", "ruby", "rb",
    "php", "swift", "sql", "yaml", "yml", "json", "html", "xml", "css",
    "scss", "less", "markdown", "md", "lua", "perl", "kotlin", "scala",
    "haskell", "hs", "elixir", "clojure", "erlang", "ocaml", "r", "matlab",
    "diff", "patch", "nginx", "makefile", "dockerfile", "plaintext", "text",
]

LANG_PATTERN = "|".join(LANG_LIST)


class SyntaxHighlightedCodeSpan(SpanToken):
    pattern = re.compile(
        r"(?P<lang>(?:%s)?)(?P<open>`+)(?P<body>.*?)(?P=open)" % LANG_PATTERN,
        re.DOTALL,
    )
    parse_inner = False
    precedence = SpanToken.precedence + 2

    def __init__(self, match):
        self.language = match.group("lang").strip()
        self.body = match.group("body")


class Math(SpanToken):
    pattern = re.compile(r"(?:^|(?<!\\))\$(?P<body>(?:\\\$|[^$])*)\$")
    parse_inner = False

    def __init__(self, match):
        self.body = match.group("body")


class DisplayMath(SpanToken):
    pattern = re.compile(r"\$\$(?P<body>.*?)\$\$", re.MULTILINE | re.DOTALL)
    parse_inner = False
    precedence = SpanToken.precedence + 2

    def __init__(self, match):
        self.body = match.group("body")


class DisplayMathEnv(SpanToken):
    pattern = re.compile(
        r"\\begin\s*{(?P<env>(?:equation|eqnarray|align)\*?)}(?P<body>.*?)\\end\s*{(?P=env)}",
        re.MULTILINE | re.DOTALL,
    )
    parse_inner = False
    precedence = SpanToken.precedence + 1

    def __init__(self, match):
        self.body = match.group("body")
        self.env = match.group("env")


class SiteRenderer(HTMLRenderer):
    def __init__(self):
        HTMLRenderer.__init__(
            self,
            DisplayMathEnv,
            DisplayMath,
            Math,
            SyntaxHighlightedCodeSpan,
        )

    def render_syntax_highlighted_code_span(self, token):
        if token.language:
            return '<span class="hl"><code class="lang-%s">%s</code></span>' % (
                token.language,
                html_mod.escape(token.body),
            )
        return "<code>%s</code>" % html_mod.escape(token.body)

    def render_math(self, token):
        return '<math class="cs_math_to_render">%s</math>' % token.body

    def render_display_math(self, token):
        return '<displaymath class="cs_math_to_render cs_displaymath">%s</displaymath>' % token.body

    def render_display_math_env(self, token):
        return '<displaymath class="cs_math_to_render cs_displaymath" env="%s">%s</displaymath>' % token.env


def render_markdown(text):
    """Convert markdown to HTML with extensions."""
    with SiteRenderer() as renderer:
        return renderer.render(Document(text))


# ---------------------------------------------------------------------------
# Diagram Detection (ASCII art bounded by *s → <diagram> tags)
# ---------------------------------------------------------------------------

DIAGRAM_START = re.compile(r"^\s*\*{3,}\s*$")


def _replace_diagrams(html_src):
    """Find diagram blocks in rendered HTML and wrap them for cs_diagrams.js."""
    ix = 0
    diagram_index = 0
    diagram_sources = {}
    lines = html_src.splitlines(keepends=True)
    result = []

    while ix < len(lines):
        line = lines[ix]
        match = DIAGRAM_START.match(line)
        if not match:
            # check if this is a code block that might contain a diagram
            if line.startswith("<pre><code>") and "diagram" in line.lower():
                # treat code blocks tagged 'diagram' as diagrams
                inner = []
                ix += 1
                while ix < len(lines) and not lines[ix].startswith("</code></pre>"):
                    inner.append(lines[ix])
                    ix += 1
                if ix < len(lines):
                    ix += 1  # skip closing </code></pre>
                diag_text = "".join(inner)
                diag_text = html_mod.unescape(diag_text.strip())
                diag_id = "diagram_%d" % diagram_index
                diagram_sources[diag_id] = diag_text
                result.append(
                    '<diagram id="%s" style="display:none">%s</diagram>\n'
                    % (diag_id, html_mod.escape(diag_text))
                )
                diagram_index += 1
            else:
                result.append(line)
            ix += 1
            continue

        firstline = ix
        firstix, lastix = match.span()
        group = match.group(0)

        jx = ix + 1
        found = False
        while jx < len(lines):
            if jx >= len(lines):
                break
            line_j = lines[jx]
            if len(line_j) >= lastix and line_j[firstix:lastix] == group:
                # found closing border
                found = True
                jx += 1
                break
            if len(line_j) <= firstix or line_j[firstix] != "*":
                break
            jx += 1

        if found:
            diag_lines = lines[firstline:jx]
            diag_text = "".join(diag_lines).strip()
            diag_id = "diagram_%d" % diagram_index
            diagram_sources[diag_id] = diag_text
            result.append(
                '<diagram id="%s" style="display:none">%s</diagram>\n'
                % (diag_id, html_mod.escape(diag_text))
            )
            diagram_index += 1
            ix = jx
        else:
            result.append(line)
            ix += 1

    return "".join(result), diagram_sources


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


def _load_json(path):
    p = Path("content") / path
    if p.exists():
        with open(p) as f:
            return json.load(f)
    return []


def _read_md(path):
    """Read a markdown file, return rendered HTML + diagram sources."""
    p = Path("content") / path
    if not p.exists():
        return None, None
    with open(p) as f:
        md = render_markdown(f.read())
    html_out, diagram_sources = _replace_diagrams(md)
    return html_out, diagram_sources


def _compile_context(**extra):
    """Build template context with common variables."""
    ctx = {
        "site_title": "Jason Hong",
        "current_year": datetime.now().year,
        "breadcrumbs": [("Home", "/")],
        "projects": _load_json("projects/index.json"),
        "blog_posts": _load_json("blog/index.json"),
    }
    ctx.update(extra)
    return ctx


@app.route("/")
def home():
    html, diagrams = _read_md("index.md")
    ctx = _compile_context(
        content=html or render_markdown(
            "# Jason Hong\n\nWelcome to my personal site.\n\n"
            "Check out my [projects](/projects) and [blog](/blog)."
        ),
        diagram_sources=diagrams or {},
        content_header="Jason Hong",
        breadcrumbs=[],
    )
    return render_template("base.html", **ctx)


@app.route("/projects/")
def projects():
    html, diagrams = _read_md("projects.md")
    projects_data = _load_json("projects/index.json")
    if not html:
        cards = ""
        for p in projects_data:
            tags_html = " ".join(
                '<span class="tag">%s</span>' % t for t in p.get("tags", [])
            )
            cards += (
                '<div class="project-card">'
                '<h3>%s</h3>'
                '<p>%s</p>'
                '<div class="tags">%s</div>'
                "</div>"
            ) % (p["title"], p["description"], tags_html)
        html = "<h1>Projects</h1>\n\n" + cards
    ctx = _compile_context(
        content=html,
        diagram_sources=diagrams or {},
        content_header="Projects",
        breadcrumbs=[("Projects", "/projects")],
    )
    return render_template("base.html", **ctx)


@app.route("/blog/")
def blog():
    html, diagrams = _read_md("blog.md")
    posts = _load_json("blog/index.json")
    entries = ""
    for post in posts:
        entries += (
            '<div class="blog-entry">'
            '<a href="/blog/%s">%s</a>'
            '<p>%s</p>'
            "</div>"
        ) % (post["slug"], post["title"], post.get("description", ""))
    if not html:
        html = "<h1>Blog</h1>"
    html += "\n\n" + entries
    ctx = _compile_context(
        content=html,
        diagram_sources=diagrams or {},
        content_header="Blog",
        breadcrumbs=[("Blog", "/blog")],
    )
    return render_template("base.html", **ctx)


@app.route("/blog/<slug>")
def blog_post(slug):
    posts = _load_json("blog/index.json")
    post = next((p for p in posts if p["slug"] == slug), None)
    if not post:
        abort(404)
    html, diagrams = _read_md("blog/posts/%s.md" % slug)
    if not html:
        abort(404)
    ctx = _compile_context(
        content=html,
        diagram_sources=diagrams or {},
        content_header=post["title"],
        breadcrumbs=[("Blog", "/blog"), (post["title"], "")],
    )
    return render_template("base.html", **ctx)


@app.route("/resume/")
def resume():
    html, diagrams = _read_md("resume.md")
    if not html:
        html = '<h1>Resume</h1>\n\n<p><a href="/static/resume.pdf" class="btn">Download Resume (PDF)</a></p>'
    ctx = _compile_context(
        content=html,
        diagram_sources=diagrams or {},
        content_header="Resume",
        breadcrumbs=[("Resume", "/resume")],
    )
    return render_template("base.html", **ctx)


@app.route("/aoc/")
@app.route("/aoc/<int:year>/")
@app.route("/aoc/<int:year>/<int:day>")
def aoc(year=None, day=None):
    if year is None:
        html, diagrams = _read_md("aoc.md")
        if not html:
            html = "<h1>Advent of Code</h1>\n\n<p>Solutions coming soon.</p>"
        ctx = _compile_context(
            content=html,
            diagram_sources=diagrams or {},
            content_header="Advent of Code",
            breadcrumbs=[("AoC", "/aoc")],
        )
    elif day is None:
        html, diagrams = _read_md("aoc/%d.md" % year)
        if not html:
            html = "<h1>Advent of Code %d</h1>\n\n<p>Solutions coming soon.</p>" % year
        ctx = _compile_context(
            content=html,
            diagram_sources=diagrams or {},
            content_header="Advent of Code %d" % year,
            breadcrumbs=[("AoC", "/aoc"), (str(year), "")],
        )
    else:
        html, diagrams = _read_md("aoc/%d/%02d.md" % (year, day))
        if not html:
            abort(404)
        ctx = _compile_context(
            content=html,
            diagram_sources=diagrams or {},
            content_header="Day %d - %d" % (day, year),
            breadcrumbs=[("AoC", "/aoc"), (str(year), "/aoc/%d" % year), ("Day %d" % day, "")],
        )
    return render_template("base.html", **ctx)


# ---------------------------------------------------------------------------
# Static files
# ---------------------------------------------------------------------------

@app.route("/static/<path:filename>")
def static_files(filename):
    return send_from_directory("static", filename)


# ---------------------------------------------------------------------------
# Error handlers
# ---------------------------------------------------------------------------

@app.errorhandler(404)
def not_found(e):
    ctx = _compile_context(
        content="<h1>404</h1>\n\n<p>Page not found.</p>",
        diagram_sources={},
        content_header="404",
    )
    return render_template("base.html", **ctx), 404


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8080)
