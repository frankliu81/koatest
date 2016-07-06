# Running the MVP

**Pre-requiste**:
  - node.js v5.11
  - mongodb v3.2.6

**Steps**:
1. In Terminal, start the mongo daemon

  **$ mongod**

2. In Terminal, git clone the application, at the root of the cc_frank_liu folder

  **$ nodemon**

  nodemon will automatically start the server in app.js at http://localhost:3000

  Any change to the code will be hot loaded.

3. In Terminal, execute the mocha test by running

  **$ ./node_modules/mocha/bin/mocha ./tests/getSongRecommendations.js**

  There are three different testcases:

  i) Adds the songs the users listen to from listen.json

  ii) adds the users that a user is following from follows.json

  iii) returns the recommendations for user id 1 (user "a")

  Expected Terminal output is:

  http://localhost:3000/listen/1/2
  http://localhost:3000/listen/1/6
  http://localhost:3000/listen/2/4
  http://localhost:3000/listen/2/9
  http://localhost:3000/listen/3/8
  http://localhost:3000/listen/3/7
  http://localhost:3000/listen/4/2
  http://localhost:3000/listen/4/6
  http://localhost:3000/listen/4/7
  http://localhost:3000/listen/5/11
      ✓ adds the songs the users listen to from listen.json (154ms)
  http://localhost:3000/follow/2/4
  http://localhost:3000/follow/2/3
  http://localhost:3000/follow/1/3
  http://localhost:3000/follow/1/2
  http://localhost:3000/follow/2/5
  http://localhost:3000/follow/3/1
      ✓ adds the users that a user is following from follows.json (49ms)
  http://localhost:3000/recommendations?user=1
  Recommendations:
  { list: [ '9', '3', '4', '7', '10' ] }
      ✓ returns the recommendations for user id 1  (44ms)


    3 passing (302ms)

**Notes**:

1. On server start, the SongRecommender database will be created.  music.json will be loaded into the mongodb database SongRecommender automatically.  If it has been loaded previously, it will not be duplicated.  

  I also added a users.json which will be loaded automatically as well.  My assumption is that there will be some way of creating users first, before we call the listen API to associate user and the song that he/she had listened to.  

2. I use robomongo tool to view my mongo database.  If you want a clean setup, you can drop the SongRecommender database from there, and re-run nodemon to recreate.

# Design Q&A

**1) Describe in a high level the solution you have in mind**


  **Summary:**

  The algorithm I came up with figure out the musical preference of the user by  tallying up the tags for the songs that the user has listened to, and add to it also the tally of the tags of the songs that the user's first-degree followees (who the user follows) had listened to.  The idea is that if a tag is used by a user and his followees frequently, then we would likely be recommending a song with the same tag to the user.

  Next, for the list of the songs that the user has not heard, we calculate a relevance score by looking at each tag of the song.  We sum the relevance score for the song by how frequent each tag has been used in the user and user's followees tag tally previously determined.

  Finally, we sort the song id, by relevance score, and return the top five results.

  **Other alternative considered:**

  Looking at common recommender system algorithm like k-nearest neighbor, I have considered defining some sort of vector distance calculations to determine a song that is closest to what the user and users' followees have heard.  

For example, music.json can be expressed with the following vectors.

  |              | m1 | m2 | m3 | m4 | m5|
  | ---          | ---| ---| ---| ---|---|
  | jazz         | 1  |    |    |    |   |
  | old school   | 1  |    |    |    |   |
  | instrumental |    |    |    |    | 1 |
  | samba        |    |  1 |    |    |   |
  | 60s          |    |  1 |    |    |   |
  | rock         |    |    |  1 |  1 |   |

  But considering the tag values are either 0 or 1, and not a numerical scale, doing a bunch of (1-0)^2 calculation for each tag that are not in common between m1 and m2 to determine m1 and m2 are far from another, seems like over-engineering the solution given what we have to model.

**2) What other data could you use to improve recommendations?**


i) Let the users rate how they like the different song tags that we have, from a score of 0 to 5.  For example, a 5 for rock means the user likes rock a lot.

ii) Let the users rate how much they like the song, with a score of 0 to 5.  For example, a 5 for a song means they user like this song a lot.


**3) Assume a more real world situation where you could have more data you described above, and more time to implement, could you think of a possibly more efficient way to recommend?**

i) With the tag preference data from 2) i), where we rate the how much the user likes each category.

We could have for example the following:

||Frank	| Andre |	Marc |
|---|---|---|---|
|jazz	|1|	1	|3|
|rock	|4|	5	|3|
|pop	|5|	4	|3|

Imagine a large-list of users, we can calculate the distance that each user is to one another, using the preference vector, and find the k-nearest neighbors.  In the example above, the distance between Frank and Andre is sqrt( (1-1)^2 + (5-4)^2 + (4-5)^2 ) = sqrt(2).  Frank and Andre are closest preference-wise, so that any songs that Andre has heard but Frank has not heard, we could consider directly recommending to Frank.  The advantage of this algorithm, is that once we figure out the similarities between users, the recommendations part would be straightforward (ie. what the similar user has heard that the user hasn't).

ii) With the song rating information in 2 ii), we could implement a item-based collaborative filtering algorithm with map reduce.

• Ex. Person A watched Star Wars 1 and 2 and rated them similarly,

•  Person B watched Star Wars 1 and 2 and rated them similarly,

•  Person C just watched Star Wars 2, and we would recommend them Star Wars 1.

An example of the output of this algorithm is below, for each movie, there is a similarity rating scpre to each other movie, as well as how many users have rated this pair of movies.

"Star Wars (1977)"	["Meet John Doe (1941)", 0.9851718095561594, 24]
"Star Wars (1977)"	["Return of the Jedi (1983)", 0.9857230861253026, 480]
"Star Wars (1977)"	["Empire Strikes Back, The (1980)", 0.9895522078385338, 345]

An example of how this algorithm is implemented, is provided in other/Movie-Similarities.py.  I did this as part of the Udemy course on Map Reduce.  The advantage of using a map reduce algorithm, is that it can be easily scaled to multiple machines in parallel.


**4) Assume you have more than one implementation of recommendations, how could you test which one is more effective using data generated by user actions?**

If we also collect a user rating for the song, when we recommend a song to the user, we can compare the rating that the user gives this song with the average rating he gives out.  If one algorithm statistically generate recommendations with a higher song rating, then we know it is a strong recommendation system.

# Implementation Q&A

**How long did this assignment take?**

I kept a quick tally of my time on this project:

day 1 Tues,
4 hours, look at koa.js, generator, figure out routes, init new project

day 2 Wedn,
6 hours, refresher on mongodb schema.  Load music.json, look over mongoose db yield calls, co npm module
Look over my python map reduce implementation for movie recommendations

day 3 Thurs
2 hours, stackoverflow post on koa with looking for song collection on start up
Another 4 hours, simple API setup for listen, add with monggose

day 4-5 break Canada day

day 6 Sun
6 hours
Look into mocha
Unit test.  For two hours, my unit test database call were silently failing until I figured out I did not make a mongoose database connection.

day 7 Mon
8 hours
Figure out asynch forEach to control flow the asyn mongoose API
Add user followership

stackoverflow post for async mongoose loop control.  asynch nature of mongoose , was my main blocker for the day.  I have to understand how to flow control my loops with the asynch mongoose calls.  

day 8 Tues
4 hours
Breaking down and then implementing the recommender algorithm

day 9 Wedn
6 hours
Code review
Error handling, refactoring
Write-up

**Where would be the bottlenecks of this solution you have implemented?**

I profiled my implementation with simple console.log of the time spent, and here is how long things are taking in ms.

- User query - 17
- Sum tags for user - 1
- Sum tags for followees - 0
- Find songs not heard - 4
- Calculate the relevance score - 1
- Sort song Id by relevance - 0

The mongoose User query populates the songs as well as the followees of the users and the songs of the followees.  That seems to be the main bottleneck.  As the number of songs grow, I would imagine other parts of the algorithm that depends on the number of songs like calculate the relevance score to grow, so more profiling would be needed.

I was thinking that if the recommendations ever start to take longer than the expected user response time, the recommendations could potentially be offloaded to a background job that is run daily or at some other frequency.  So that calling the recommendations API simply return the pre-calculated recommendations.

**What was the hardest part?**

The hardest part for me was dealing with the asynchronicity of javascript, and also quickly get up to speed with the koa framework to be productive.

When I was running the unit test in a for loop with mongoose queries for each user, I wasn't getting results that I would expect (last iteration dropped .. etc.).  This is until I found out about async.forEach module for call flow-control.

**Did you learn something new?**

Absolutely!  I learnd about generators in ES6, and using yield in koa framework to get rid of callback hell is really neat.

**Do you feel that your skills were well tested?**

 Yes, I think where I am tested the most is whether I can learn a new framework quickly, and produce something with it.  I was more focused on getting the basics to work, as there are many pieces to ramp up on.  Koa frameowrk, mongoose, mocha test.  So I think it is a good test of my learning ability.  Since koa is something that none of the people I know are familiar with, it is an added challenge to try to unblock myself quickly through documentation reading and stackoverflow posts.

 On the other hand, because I am mainly concerned with getting the MVP done and learning the framework, perhaps I have researched less on the algorithm part of a recommendation system.
