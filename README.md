# TyresontheDrive Technical Test
This is my take on the technical test seen at the end of this file.

You can run the app here : https://phyros64.github.io/tyresonthedrive/

## Technical decisions
I decided to use OpenUI5, an open version of SAPUI5 which I used during my last job. Please note that this was the 
first UI5 project I had to build on my own, which took me a bit more time than expected.

This is also my first time using Github and its hosting page feature. I hoped to use it to test and run my application without hosting it
 localy, but considering the time it sometimes took to refresh the page, I should have hosted localy too. It would have prevented
 me to do far too many commits, with a good number of them crashing the app or some of its features. On the other hand, 
 you will be able to assess my work as I went.
 
## Features
The main feature - persistence of data - was something I had never done before. After a quick research, I found that
 [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) would allow me to do exactly that.
 All notes and notes metadata are stored localy and retrieved when starting the App.

Deletion, modification, sorting, categorization/tagging and archiving were the other features I developed. 
All of these should work as intended, even though some filters with tags could have been added.

I chose not to work on exporting the data to a file because I never worked on this kind of behavior and did not want to loose too much 
time researching it.

## Final Note
I want to thank you for giving me the opportunity to complete this technical test, which I really enjoyed. I spent around 8 hours 
to complete it to my liking.

I look forward to continuing the recruitment process and hopefully meeting you to discuss this test.

Best regards,

Nicolas Janvier

-----------------------------

## Technical test description
### Note taking application technical test
As a non-technical user, I would like to be able to take quick notes in my browser.
These notes would vary in length, from a few words up to whole paragraphs and
should persist across page loads. The user must be able to delete these notes
individually. You may use any framework or toolkit of your choice, but the application
should load and render in a reasonable time (&lt;3s) on a low-latency broadband
connection. The application must support the latest version of the Chrome browser.
You may take as long or little time as you like, but please include the time spent in
your delivery.

### Delivery
You may submit your application as a github link, zip file, codepen link or similar
methods. However it is submitted, the delivery must include all source files required
to build the application (build scripts, package.json, tests, etc.). If possible, include a
readme outlining decisions you made during the development process and why you
made them. You do not need to worry about serving the application, but if you do
include a mechanism to serve it then instructions on getting it up and running must
be provided. A delivery with commit history is strongly preferred (ideally git).

### Additional features
For bonus points, you may want to consider the following features (depending on
your experience and skill level):
* Sorting
* Categorization/tagging
* Exporting data to a file
* Archiving
* Modification
