


function favorite(){
    dipsButtonClicked=()=>{
        if (this.state.dipsbuttonclicked == false) {
            this.callAddWishAPI().then((response)=>{
                console.log(response);
            })
            console.log("색칠하트");
            this.setState({ dipsbuttonclicked: true });
        } else {
            this.callRemoveWishAPI().then((response)=>{
                console.log(response);
            })
            console.log("색칠안한하트");
            this.setState({ dipsbuttonclicked: false })
        }        
    }
}