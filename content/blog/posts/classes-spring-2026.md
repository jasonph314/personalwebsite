***aka the Introduction to Computer Science by way of the firehose***

*May 20, 2026*

<img src="/static/images/mitfirehose.gif" alt="MIT firehose meme" style="width:65%">

*Image credit: [MIT Hack — Fire Hydrant (1991)](https://hacks.mit.edu/Hacks/by_year/1991/fire_hydrant/)*

### Courses

*jump to read about a specific class*

- [6.1210: Introduction to Algorithms](#61210)
- [6.1910: Computation Structures](#61910)
- [6.1010: Fundamentals of Programming](#61010)
- [6.1903: Low-Level Programming in C and Assembly](#61903)
- [6.100B: Computational Thinking and Data Science](#6100b)

### ASEs that I took as well
- 8.01 - Physics: Mechanics *(took this in the summer)*
- 8.02 - Physics: Electricity and Magnetism *(winter)*
- 6.100A - Introduction to CS and Programming using Python *(winter)*

<a id="prologue"></a>
## Prologue

addi, sp, sp, -SPRING_SEMESTER_26

My first semester at MIT is in the books! At the time of writing this, my finals have yet to be graded so these thoughts are pretty fresh. I just landed back home and I'm excited to do some relaxing which I haven't gotten to do often this semester. The semester was by no means easy, nor was it necessary (it didn't really move my timeline up) BUT...I decided that I wanted to push myself and try out an "MIT-esque" semester. There were times were I deeply regretted doing so. My weeks often looked like this. 
*<span class="tooltip" data-tip="Introduction to Algorithms">6.121</span> pests due Tuesday, <span class="tooltip" data-tip="Low-Level Programming in C and Assembly">6.1903</span> labs on Wednesday, <span class="tooltip" data-tip="Fundamentals of Programming">6.101</span> lab checkoff due Wednesday, <span class="tooltip" data-tip="Computation Structures">6.191</span> lab checkoff due Wednesday, <span class="tooltip" data-tip="Computation Structures">6.191</span> lab due on Thursday, <span class="tooltip" data-tip="Fundamentals of Programming">6.101</span> lab due Friday, <span class="tooltip" data-tip="Fundamentals of Programming">6.101</span> readings due Sunday, <span class="tooltip" data-tip="Low-Level Programming in C and Assembly">6.1903</span> labs due Sunday.* 

Then somewhere in there sprinkled in my lowest moments throughout the week, we had microquizzes and psets for <span class="tooltip" data-tip="Intro to Computational Thinking and Data Science">6.100B</span>. Not only were all these labs and assignments due literally all day, EVERY DAY, we also still had a boat load of exams to study for. In March alone I had 7 exams and quizzes. In April I had 5 exams and quizzes. In May I had 3 finals and a Design Project *(~20+ hrs of work)* to finish for <span class="tooltip" data-tip="Computation Structures">6.191</span>. 

My Wednesdays were particularly draining. I had a 9AM recitation for 6.101, followed by a 10AM recitation for 6.191, followed by an 11AM 1.5 hour lecture for 6.100B, followed by a 1PM recitation for 6.121, followed by a 2:30PM lab for 6.1903 that lasted 2.5 hours.

Granted, I missed a few lectures and recitations here and there. I'm not naturally a morning person. 

$$\text{Doing labs} \nRightarrow \text{doing well on exams}$$


Even with all that though, I can look back and say that I'm glad that I went through this. And I'm especially thankful for the people around me who supported me. Those boba and food deliveries when I was drowning in Minispec code...that meant the world.

Taking these specific set of classes though had a really profound impact on my experience in studying Computer Science. There was so much overlap in core concepts across all of my classes, and I got to see techniques applied many times over and for many different reasons. There was a specific day when I realized I would write this blog and title it what I did.

On one of our last recitations for <span class="tooltip" data-tip="Introduction to Algorithms">6.121</span>, the TA wrote on the board "0/1 Knapsack". I had an instantaneous flashback to my first day of lecture in <span class="tooltip" data-tip="Intro to Computational Thinking and Data Science">6.100B</span>...where we literally covered the exact same topic but with a more beginner-friendly lens. Moments like this happened ALL the time this semester. I remember finishing up the Bacon Number lab for <span class="tooltip" data-tip="Fundamentals of Programming">6.101</span> which covered SSSP, then a week later, covering BFS/DFS in <span class="tooltip" data-tip="Introduction to Algorithms">6.121</span>, then taking a quiz on it in <span class="tooltip" data-tip="Intro to Computational Thinking and Data Science">6.100B</span>. All classes covering the same topic, but just covering them to various degrees of rigor. <span class="tooltip" data-tip="Introduction to Algorithms">6.121</span> required correctness proofs and runtime analysis, <span class="tooltip" data-tip="Fundamentals of Programming">6.101</span> required precise implementations in code, <span class="tooltip" data-tip="Intro to Computational Thinking and Data Science">6.100B</span> asked more conceptual questions about real world examples.

One of my favorite synchronous moments was taking my <span class="tooltip" data-tip="Introduction to Algorithms">6.121</span> midterm 2 which covered all things graph related, and in particular, topological ordering. Immediately after taking that midterm, I had to rush over to my <span class="tooltip" data-tip="Fundamentals of Programming">6.101</span> lab checkoff for Frugal Sheets where we discussed a DFS algorithm to find topological ordering in order to achieve efficient updating of cells in our spreadsheet implementation.


And the class that really tied it all together, my favorite class of the semester --- **6.191: Computation Structures** (alongside the companion class <span class="tooltip" data-tip="Low-Level Programming in C and Assembly">6.1903</span>)

Implementing recursive functions and sorting algorithms in the lord's language brought me to the gates of the CPU. And on the other side of those gates was <span class="tooltip" data-tip="Computation Structures">6.191</span>...

Before I dive into the actual experience and rating of each course, I want to emphasize my biggest takeaway that these classes gave me as a whole. I walked away from this semester asking myself a few fundamental questions:

1. What is computation?

2. How can we make computation better (or more efficient)?

These questions are much more philosophical than I had initially thought. After taking these courses, the lens from which I look at computers has been completely shifted. As my <span class="tooltip" data-tip="Computational Thinking and Data Science">6.100B</span> professor John Guttag had put it in our last lecture, "computational thinking is a mode of thought". That sat with me deeply. Many different philosophies about what a computer ought to be came and went. Some stuck around, some are reaching the end of their life as we speak. I was mindblown when Joe Steinmeyer showed us the history of old machines and the random things computer scientists and engineers were trying back in the day *([Check out trinary computers](https://en.wikipedia.org/wiki/Ternary_computer))*


This semester can most aptly be characterized by the following Spongebob meme...coommmmmpuutttteerrrr sciennnnnceeeeeee

<img src="/static/images/computer_science_spongebob.jpg" style="width:60%">

```python
def hello_world_printer():
    helloworld('print')
```

<a id="lets-talk"></a>

## Let's talk about the courses

<a id="61210"></a>

### <span class="tooltip" data-tip="Introduction to Algorithms">6.1210</span> — Introduction to Algorithms

<img src="/static/images/starly.png" style="width:30%"> <img src="/static/images/frieren.jpg" style="width:30%"> <img src="/static/images/pokemonlogo.jpg" style="width:30%">

*---Every problem set involved either Pokemon, the course staff, or Frieren. Literally no in between*

A TA described this class to me as a *"problem-solving class"* which I had no real reference about what that entailed. Weren't all classes "problem-solving classes"? After taking this class...I understand it now.

Prior to this course, I hadn't had any prior exposure to data structures and algorithms aside from the random Youtube video watching and the occasional attempt at solving Leetcode problems. Or brainrot Stewie and Peter Griffin explanations of Dijkstra's on TikTok.

***What I Learned***

The course covers all the canonical data structures and algorithms that you would learn at most other schools, except on a really compressed timeline. In 13 weeks of instruction + a final on the last week, we covered everything that a normal school might cover in 15 weeks. Runtime analysis, sorting algorithms, hashing, data structures, BFS, DFS, Kosaraju-Sharir, Dijkstra's, Bellman-Ford....all the way up to Complexity and Computability. Which as I typed all of this out, I'm realizing how insane this was. 

The focus though was not on the implementation, but leveraging these algorithms that are well-known and studied, to solve some really really really interesting and difficult problems. Most pests felt like Leetcode medium-hards and exam questions felt mostly like tricky Leetcode mediums. Eventually every problem became this:

- I have my toolbox of algorithms of data structures. My goal is to mold and break the problem down so I can blackbox this
- Noticing structures in the problem that a known algorithm could handle
- Ensure the problem is correct for edgecases using proof by induction
- Okay, how do I optimize my runtime if possible? is this runtime asymptotically optimal?

***Advice***

1. **Do your pests honestly and struggle with them.** If you're new to this world of algorithmic thinking and problem-solving, this class can be particularly brutal. I would stray far far away from relying on past exams to guide your exam prep. The pests give you that 6th sense because it forces you to explore methods that are not so straightforward, which allow you to come to truths that you would not have otherwise.

2. **Be creative.** Do not fixate on following a set formula or method to getting an answer. Those are a means to an end and never build real understanding. You should be to experimenting with silly ideas and develop YOUR OWN intuition about solving problems. Giving yourself permission and creative freedom builds an intuition that only belongs to you!!! And that's probably the most valuable part of the class. Yes yes ther are canonical solutions to problems, but what matters is how your mind is shaping because of it.

3. **ATTEND LECTURES, TALK TO PROFESSORS AFTER.** This alone enhanced the experience of the class 100x. Those small moments were when I realized that AI cannot replace that kind of experience. Human-to-human conversation can unlock profound insights about things you wouldn't have even thought of. 

4. **Pick a really good recitation leader**. Those sessions can save you hours worth of self-learning and struggle that's just unnecessary. I didn't realize this until it was too late but I'm super thankful that I walked into a random recitation section. I ended up trying to stick with them because I really liked the way that they explained the concepts. 

5. **This advice is more for MIT students specifically.** But I would try to brush up on <span class="tooltip" data-tip="Math for CS">6.1200</span> knowledge if you can. Many things you can pick up along the way, however, Brynmor does reach really deep into 6.1200 territory in order to solve the harder problems. 


***Favorite Concept***

Kosaraju-Sharir / topological ordering. Two completely independent discoveries. Kosaraju discovered the algorithm but didn't bother to write it down. Sharir had the algorithm as a side-note as a method to solve a problem for his own research. It's such an elegant tool and reduction on graphs that I kept thinking about it throughout the semester. How do you ensure that you get all of the Strongly Connected Components?....just reverse the graph and then run Full DFS. LIKE WHAT?!!? I had to ask Will Leiserson like 100 times, "are you sure this guarantees that we get all of em?". And now that the semester is over, I completely understand. 

Topological ordering really scratched that "systems" portion of my CS brain. I'm not fully sure how to describe why I enjoyed using and exploiting it so much, but yeah it was really really cool to see in action.

*[IOI winner and MIT alum William Lin using the algorithm for his YT video](https://youtu.be/qz9tKlF431k?si=c4sa2inNV4P_0EJR&t=1041)*


<a id="61910"></a>

### <span class="tooltip" data-tip="Computation Structures">6.1910</span> — Computation Structures

```
+----------------------------+
|         packmul()          |
|       RISC-V INSIDE        |
|                            |
+----------------------------+
```

<img src="/static/images/riscv_inside.png" alt="RISC-V inside sticker" style="width:30%;margin-top:1rem;"> <img src="/static/images/6191_DP_leaderboard.png" alt="Design Project leaderboard" style="width:30%;margin-top:1rem;">

This is the class where you finally get to answer the question "HOW DOES A COMPUTER WORK?". If you're a CS major just starting out, chances are you've heard vague ideas about what's going on underneath the hood. *it's all 1s and 0s, it's just transistors switching on and off, it's line-by-line instructions*. Like yes sure, but what does that even mean - how did we get here? Why did we get here? What's so fundamental about 1s and 0s that we chose to do it this way?

6.191 walks you through what I like to think of as **The history of modern computing**. The course starts off with learning about the Voltage Transfer Characteristic and how to represent states/information in a consistent and efficient manner. We moved on to representing CMOS technology and real logic with Boolean Algebra. Slowly, week by week, we built up components and machinery that could perform simple computations, that when performed at high speed and scale could really do a lot. We had 7 labs for the class, and each lab was focused on implementing the different layers of abstraction. This was done in Minispec, my first exposure to a Hardware Description Language (HDL).

I'll be so frank, the first 3-5 weeks of class were a drag. Much time was spent simplifying really long and annoying Boolean Algebra or tediously tracing through FSMs and register timings. Friends who had taken this class told me this was supposed to be enlightening but the start really felt like a lot of drills and grunt work....and then *lecture 11 hit - Single Cycle Processor*.

This lecture gave me literal *CHILLS*. Silvina began the lecture by explaining the idea of incremental featurism. She began talking through all the different capabilities that we needed slide by slide. The lecture had a very Socratic feel to it. It was a back and forth dialogue. One slide proposes a question "How do we implement a branch instruction? How do we send data from memory to the destination register?". The next slide answers "Add a mux and a selector bit to choose the next PC. Add a mux to select data". 

With each slide, I was just following along. Seeing all the hardware that we had learned about and implemented in labs prior appear with each slide. All of a sudden -- "and now we have a fully functional RISC-V processor" My mind was blown....after putting all the pieces into place, WE HAD A REAL PROCESSOR 🤯 🤯 !! This was the moment I was looking for in my entire CS education. To me, this type of knowledge felt as fundamental as learning Calculus. It gave me the same feeling that learning Physics 1 and 2 gave me. That *WOW* moment really hit me deeply. 

All the lectures that followed were about optimizing performance on our processor (learning about cache coherence, performance engineering, operating systems, etc.)! But to me, the bang for my buck came from that moment. These days, when I'm scrolling on my phone, I have serendipitous moments of just amazement at the machinery in my hand. This course completely demystifies what a computer is. I highly recommend anybody to take on the challenge of learning the concepts in this course...and you will too feel as though you can build a computer from scratch. 

***What I Learned***

Much of my learning really came together from working on the Design Project. The project involved optimizing a neural network using the RISC-V processor that we built in prior labs. It taught me that... you could just try stuff and see if it works, that there was never a *set in stone implementation* of a computer. You could pipeline your processor as crazy as you wanted. Extend your cache to be as large as your heart desires. Unroll your loops to the moon and back. Implement any custom instruction that you see fit. With the entire goal centered around this one thing **SMALLER RUNTIME MEANS MORE OPTIMIZED**. By any means necessary, just get the time down. 

In the future, there may come a time where old paradigms that have done us well may hit their natural ceiling. And it's up to you/us to be willing to explore new paths and ideas to get more out of our machines. That whole Moore's Law fading out and all.

I learned in real time that there is *no free win* in this game of performance engineering. Optimizing for speed usually trades for area, optimizing for cycles usually increases your clock period, and optimizing clock period can lead to more cycles. It was a delicate balance of all the lessons and techniques to get the full 20/20 points. The most important thing I learned was the amount of performance that you could get from **software** alone!! Writing performant code really makes a huge difference...although sometimes this trades readability. 


***Advice***

For prospective students of the class - I'm going to parrot what was told to me. It's advice as old as time. 

1. **RECITATIONS.** If you're new to learning about computer architecture like I was, ensure that you get a really good recitation leader. If one doesn't stick, it's fine! Just try another one. My recitation leader Raul really made the difference for me in this class and I ended up getting an A in the class.
2. **EXAMS.** The exams really push your ability to solve the problems *quickly*. Luckily, past exams do translate really well to the real exam but it is important to use those as diagnostics. The recitation exercises give a good idea of how complex the questions will be on the exam. Just like any exam though, they're really good at writing new problems. So understanding the concept is crucial. One freeze up on a question during the exam and you're dead in the water. There's not much time to ponder and derive things from first principles. Do the recitations...please do all of the exercises.
3. **LABS.** Some labs were easier than others, some were VERY long. This is also parroted advice, but it's legit. Get started as soon as the labs come out if time permits. The TAs and LAs are heaven-sent, these people are really good at what they do and can all explain concepts really well. Also, coding in Minispec is pretty unnatural at first. Describing hardware is not the same as writing software. Taking the time to process that and talking through that in Office Hours really goes a long way. Plus some Exam questions require you to write Minispec code on paper. So it's really really helpful. 

***Favorite Concept***

Everything. Literally all of it. Actually, if I had to pick one, it was the fact that operating systems are just...more code. There are nuances of course, but it's literally just more code that handles special privileges and abstractions!


<a id="61010"></a>

### <span class="tooltip" data-tip="Fundamentals of Programming">6.1010</span> — Fundamentals of Programming

<img src="/static/images/pythonlang.png" alt="Python language" style="width:30%">

*THE premier Python programming class*

One of my harder classes this semester. I was fresh off of taking the 6.100A ASE and this course REALLY pushes you to level up your programming skills quickly. There were weekly readings, recitations, and labs due every week. The labs were pretty heavy each week if you weren't proficient in programming. The course followed a very routine structure though which I liked. The readings covered concepts at a high level, the labs get into the details about how to apply those concepts to solve problems.

I'm not going to lie, this class felt pretty tedious most times for me. There were a lot of moments where I was reading the spec and just wondering "but why?". Looking back, this was a horrible lens to view the class. I was quite spoiled by the abstractions and blackboxxing that we were allowed to do in 6.121. But now that I've had some time to reflect on the class, the labs were really where I built my programming speed and muscle. Solving problems via code is what this class was all about. Each lab was extremely well-designed and really drove the point home. The checkoffs were fun but also really brutal. If you had just finished your lab at 5PM on Friday and then went in for a checkoff on Wednesday, consider the code gone from your mind. Walking into checkoffs without any preparation or review of your code is a recipe for disaster. Those checkoffs really drove some of the points home for me and were at the minimum a good exercise for active recall and spaced repetition.

*The silver lining* - The LISP Interpreter. This lab was notoriously really long and tedious. Writing an interpreter for LISP required putting every concept that we had learned to real use. Ok, remember how I said that the class felt really tedious most times for me? For some reason, this lab I found extremely enjoyable. The lab was really long, but I felt like I saw the vision for this course lol. I saw functional programming in full force during this lab and I just started to appreciate all of the concepts that we learned throughout (functions as first-class objects, recursion, backtracking, BFS, object-oriented programming, etc.)


***Advice***

For prospective students of this class - immerse yourself in the labs. They're sometimes really really annoying and difficult, but the takeaways are ALWAYS worth it. I think the skills and ideas that you learn in this class translate really well to technical interviews and give you great intuition for how to write programs. Many will say it's unrealistic, which it probably is. Not much of software engineering is about writing things from scratch or reading a perfectly written spec. But the training you get from this class and the ability to view functions as first-class objects is a game changer and can lead to writing readable, clean code.

1. **EXAMS**. Focus on the readings. Focus on the concepts. The readings offer additional exercises and honestly those are a gold mine for studying for the exams. I would say doing the Labs alone can get you about 30% of the way there conceptually, but the rest comes down to doing the readings and attending recitations. Writing code with pen and paper is much different than spamming "pytest test.py" until you pass all testcases (this is where 6.121 correctness proofs came in handy sometimes). Past exams are once again, just a diagnostic tool to see how well-repped you are. It's not a good idea to just spam practice exams in order to pattern match concepts. The TAs and LAs for this class are really good too, so I'd strongly recommend attending office hours.
2. **LABS**. Once again, please please please start early. Take them seriously. A lot of the helper functions that the labs have you implement do end up showing up on the exam in some modified form. 
3. **QUIZZES**. These aren't worth a lot of your grade. It's two quizzes that total to 10% of your grade. However, these quizzes serve as an extra measure for understanding your code deeply. They also give you a really good reason to cleanup and DRY your code so that come quiz time, you're not scrambling to edit huge amounts of code. Otherwise, those 50 minutes are going to be miserable rather than light and gentle.


***What I Learned***

This class will really show you the level of proficiency that you're at in terms of coding. Like for me, I realized that there was a difference between having that high level understanding of recursive functions, backtracking, or functional programming to being able to implement these from scratch by hand without any help. I'm by no means saying that it's necessary to know how to write these functions from scratch, but it's definitely a good indicator of how strongly you'll do on the labs.

This class does have a lot of overlap with Leetcode though and maybe to some extent technical interviews. Being able to implement many simple things and build on top of those to gain more functionality while maintaining clarity, that's a huge skill. DRYing your code was a huge part of the course and I think I got to a point where I was overdoing helper functions...BUT it made my code much more readable oftentimes. 


***Favorite Concept***

FINALLY understanding how recursion works and how to think about base cases. On my flight back from Spring Break, it finally clicked and I had to get it down on a journal. Granted, I still mess it up from time to time, but I feel like my grip on how to use recursive calls has gotten stronger. If you're struggling to understand it, you're not alone. It just takes a lot of time. 

<a id="61903"></a>

### <span class="tooltip" data-tip="Low-Level Programming in C and Assembly">6.1903</span> — Introduction to Low-Level Programming in C and Assembly

<img src="/static/images/61903_LED.png" alt="6.1903 LED" style="width:30%">

*My LED animation that I made for Valentine's Day*

The labs were pretty fun. Lots of bit manipulation and it was a really fast-paced class. We had essentially 5 weeks to learn C and Assembly proficiently enough to solve and debug simple programs. The exam was pretty rough, but at least the practice exams that they give are pretty similar. So it was grindable. 

This class was mostly in service to learning the prerequisite knowledge to 6.191. But the labs were very satisfying and it was great to see things come to life just from pure bit manipulation.

***Advice***

1. **Exams**. Every week there are sets of exercises to do. I would recommend trying to implement them by pen and paper before trying to punch in code. It really helps internalize how the languages work and it translates really well to the exam. For this class, I would say that doing the exercises to study for the exam are good for targeted focus on skills. The practice exams themselves serve as a really strong guide for studying.
2. **LABS**. The labs can take awhile. Trying to get things to work on actual hardware has some friction that is hard to get through. Otherwise, lab hours are extremely helpful (and mandatory) so if you focus hard in that 2.5 hour period, you can get a lot done.

***What I Learned***

The basics of bit manipulation, data representation in memory, and how Assembly executes instructions line by line. The class gave me a very structured view of how code interacts with the computer. 

***Favorite Concept***

IEEE floating point representations! I love it when we can symbolically represent larger numbers with separate pieces. Information can be stored in very efficient ways because of them and we get to continue to make use of the same hardware underneath.



<a id="6100b"></a>

### <span class="tooltip" data-tip="Computational Thinking and Data Science">6.100B</span> — Introduction to Computational Thinking and Data Science

Okay, I surprisingly liked this class a lot more than I had expected. The workload was pretty light overall, with the occasional cram-study for quizzes. This class is the successor to 6.100A, however, it really is not focused on the coding portion at all. The range of topics is really broad. We learned about Dynamic Programming, Graph algorithms, Probability, Statistics, and Machine Learning. We never went too deep into the math behind anything, but the class did a pretty good job of introducing these concepts at a high level, just enough to have us train our own models and answer conceptual questions. 

Little bit of this, little bit of that type of class but it was fun. The lecture slides were pretty good too, I think John Guttag put a lot of thought and effort into making sure things were entertaining. I would say the lectures did feel like a drag sometimes, but that was the nature of the material. It often felt like this was all "obvious" insights, but it was still important to drive these facts home. I thought the last section on Machine Learning and Statistics were really interesting to me. It was really a gentle introduction to what ML is, outside of the modern context of LLMs. We learned a model and did a lot of work with scikit-learn and numpy. It was cool to see our model try to make predictions and most importantly, it was interesting to see the dangers of overfitting your model.

Initially, I did think this class was super boring and shallow. But after a really hard semester of learning things deeply, this was a nice class to "decompress" in a way? lol in the most MIT way possible. The workload was really reasonable and while the quizzes were stressful, I thought that they did a good job of testing your understanding. Lots and lots of trick questions on the quizzes for sure, but with enough studying and asking questions to the TAs, you could definitely get there.

TAs were great as well and the staff overall was reasonable in their grading. There was one quiz where I had really good comments, but implemented the code wrong and they gave me really generous partial credit. So yeah like I said, way less focused on coding, and very focused on conceptual understanding. 

***Advice***

1. **Quizzes** really do make up all of your grade (60% I believe). They're not insanely hard and they're studiable. This semester they put out better material for studying so that was nice. They follow a common format of 4-6 conceptual questions with one longer coding portion. I would say the slides are your absolute best friend and source of truth when creating your crib sheet. Ask TAs lots of questions and push the bounds of your understanding by coming up with your own trick questions.
2. **PSETs** do take a long time. There's a lot of learning libraries on the spot and sometimes they're confusing to navigate, especially if its your first time. The coding itself isn't too bad, and the specs are really well written. 


***What I Learned***

The last lecture gave me a good perspective on how computation can be used in the world. It's not just about deterministic building apps and games, there's much of the world that we can model stochastic events with computation. 

John Guttag also provided us with some parting wisdom based on his time in watching the industry change and watching people attempt to make predictions. So in the wake of AI, is it even necessary to study programming and CS more broadly? 

He says something along the lines of: sure, programming as a skill will become less in demand as writing mundane code becomes easier and easier to do. However, those who can thoughtfully harness the power of computation to solve previously unsolved problems will probably rise in demand. 

That felt like a really sober take on the situation at large and I was thankful that he chose to address the situation with an honest outlook.


***Favorite Concept***

Random forests and bootstrapping. Random forests involve creating multiple trees that are learned on different datasets. How do we get those different datasets if we're limited to the one? We make it up! One such technique is called bootstrapping where we sample our data with replacement to generate some variation in our data so that each tree learns something different. Then we'll sample the data from all the trees and take the average of their answers.

For example, if we had a set of features to describe a mammal. We put those features into the random forests which asks each tree what it thinks this is (mammal or not), then it takes the average of those answers or takes a vote. Then outputs that answer. Pretty cool way to avoid overfitting on one model and also making strong use of a scarce dataset. 


<a id="epilogue"></a>

## Epilogue

<img src="/static/images/IMG_9213.jpg" alt="stickers" style="width:30%">

*plus you get some really cool stickers out of it!*

And that was my Spring 2026 semester! It was so much fun (and pain) taking all these classes. As somebody who just recently come back to school, I'm so thankful for the opportunity to study all these concepts. To many of my peers at MIT, these topics are old news and maybe things they picked up in HS or even younger, but to me, they were what I've been chasing after for awhile. Hopefully you've enjoyed reading it and hopefully it has provided you some insight into my experience that you can take away for yourself. 


As painful as some of those nights were, I would highly recommend taking this exact set of classes. It was really really valuable to me to be able to see computer science from all these different perspectives. It showed me that I really do love this stuff, and that this is something that I would like to continue studying for awhile. I had always wanted to study CS but was deterred from it from peers and other mentors. I'm so so thankful I got to have this experience. Go big or go home. 


Thank you so much for reading!

addi sp, sp, -SPRING_SEMESTER_26

