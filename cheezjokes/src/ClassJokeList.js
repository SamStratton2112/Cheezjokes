import React, { Component } from "react";
import axios from "axios";
import Joke from "./ClassJoke";
import './JokeList.css';

class JokeList extends Component {
    // set default num to 10
    static defaultProps = {numJokesToGet : 10}
    constructor(props){
        // initialize props
        super(props);
        // establish state
        this.state = {
            jokes: []
        }
        // bind instance methods to instance
        this.generateNewJokes = this.generateNewJokes.bind(this)
        this.vote = this.vote.bind(this)
    }
    // in lieu of useEffect componentDidMount will run once after the first render of componenet
    async componentDidMount(){
        if(this.state.jokes.length===0){
            await this.getJokes();
        }
    }

    // in lieu of useEffect to update state we have the below methods

    // function to request new set of jokes
    async getJokes(){
        // create copy of jokes array
        let j = [...this.state.jokes];
        // initialize a set() to ensure no duplication of jokes
        let seenJokes = new Set();
        try{
            // add jokes until j.length === numJokesToGet
            while(j.length< this.props.numJokesToGet){
                let res = await axios.get("https://icanhazdadjoke.com",{
                    headers: { Accept: "application/json" }
                })
                let {status, ...jokeObj} = res.data;
                // handle duplication
                if(!seenJokes.has(jokeObj.id)){
                    // add id to seenJokes set() 
                    seenJokes.add(jokeObj.id)
                    // add joke to j array then update state value with j
                    j.push({...jokeObj, votes : 0})
                }else{
                    console.log('Error: Duplicate Found')
                }
            }
            // update state value
            this.setState({jokes : j})
        }catch(e){
            console.log('Error:', e);
        }
    }

    // onClick function, bound to instance
    // updates state with getJokes()
    generateNewJokes(){
        this.setState({jokes : []}, async()=>{
            await this.getJokes();
        })
    }

    // onClick function, bound to instance
    // updates state to reflect new votes value
    // delta variable for 1 or -1 depending on upVote or downVote
    vote(id, delta){
        this.setState(oldState=>({
            jokes: oldState.jokes.map(j=>(
                // if the passed id matches the joke id use the value passed as delta to update the value of votes, else add the oldState joke object
                j.id === id?{...j, votes : j.votes+delta}: j
            ))
        }))
    }
    render(){
        // ensure that jokes.length !== 0
        if(this.state.jokes.length){
            // alphabetize jokes
            let sortedJokes = [...this.state.jokes].sort((a,b)=>b.votes-a.votes);

            return(
                <div className="JokeList">
                    {/* pass setState func down to child component */}
                    <button className="JokeList-getmore" onClick={this.generateNewJokes}>
                        Get New Jokes
                    </button>
                    {/* render joke component for each joke*/}
                    {sortedJokes.map(j => (<Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />))}
                </div>
            );
        };
        // return nothing if jokes.length === 0 
        return null;
    }
}
export default JokeList;