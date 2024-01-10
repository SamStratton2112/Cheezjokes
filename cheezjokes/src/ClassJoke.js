import React from "react";

class Joke extends React.Component {
    // use constructer to establish props
    constructor(props){
        super(props);
        // bind our instance methods to our instance to allow the value of votes to persist and not reset to state in parent class component
        this.upVote = this.upVote.bind(this);
        this.downVote = this.downVote.bind(this);
    }
    // use setState vote function to modify vote state value
    upVote() {
        this.props.vote(this.props.id, +1);
    }

    downVote() {
        this.props.vote(this.props.id, -1);
    }
    render(){
        // destructire joke info from props
        const {text, votes} = this.props;
        return(
        <div className="Joke">
            <div className="Joke-votearea">
                {/* use bound instance methods to update state in parent component*/}
                <button onClick={this.upVote}>
                    <i className="fas fa-thumbs-up" />
                </button>
                <button onClick={this.downVote}>
                    <i className="fas fa-thumbs-down" />
                </button>
                {votes}
            </div>
        <div className="Joke-text">{text}</div>
      </div>
        )
    }
}

export default Joke;