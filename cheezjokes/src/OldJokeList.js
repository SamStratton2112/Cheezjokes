import { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./OldJoke";
import "./JokeList.css";
// default is 10 jokes
function JokeList({ numJokesToGet = 10 }) {
  // initialize jokes
  const [jokes, setJokes] = useState([]);

  /* get jokes if there are no jokes */

  useEffect(function() {
    async function getJokes() {
      // we spread jokes from state into a new array that we can push onto 
      let j = [...jokes];
      // initialize duplicate joke list 
      let seenJokes = new Set();
      try {
        // as long as there are less jokes then provided number get more jokes
        while (j.length < numJokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          // from res.data we destructure
          // - request status 
          // - jokeObj {id, joke}
          let { status, ...jokeObj } = res.data;
          
          // if seenJokes does not include a jokeObj with joke id, add joke id to seen jokes
          if (!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id);
            // initialize votes in jokeObj
            j.push({ ...jokeObj, votes: 0 });
          } else {
            console.error("duplicate found!");
          }
        }
        // update jokes to include new jokes
        setJokes(j);
      } catch (e) {
        console.log(e);
      }
    }

    if (jokes.length === 0) getJokes();
    // include dependencies so useEffect works
  }, [jokes, numJokesToGet]);

  /* empty joke list and then call getJokes */

  function generateNewJokes() {
    setJokes([]);
  }

  /* change vote for this id by delta (+1 or -1) */

  function vote(id, delta) {
    setJokes(allJokes =>
      allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }

  /* render: either loading spinner or list of sorted jokes. */

  if (jokes.length) {
    // sort the array so that the highest voted joke is first 
    //  - b.votes - a.votes returns true or false which sets the order
    console.log(jokes)
    let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
  
    return (
      <div className="JokeList">
        <button className="JokeList-getmore" onClick={generateNewJokes}>
          Get New Jokes
        </button>
        {/* render joke component for each joke */}
        {sortedJokes.map(j => (
          <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} />
        ))}
      </div>
    );
  }

  return null;

}

export default JokeList;
