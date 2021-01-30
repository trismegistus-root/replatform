import React from "react";
import ngmi from './contracts/ngmi.json';
import "./App.css";
import WhitePaper from "./components/WhitePaper/WhitePaper.js";
import Web3 from 'web3';

let web3;


class App extends React.Component{
	constructor(props){
		super(props);
		this.state = { web3: null, accounts: null, contract: null};
		this.mintToken = this.mintToken.bind(this);
		this.addressReceipt = this.addressReceipt.bind(this);
	}

	componentDidMount = async () => {
		try {
		  web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");  //set this.state({web3})
		  const accounts = await web3.eth.getAccounts();				 //set this.state({accounts})

		  // Get the contract instance.
		  const networkId = await web3.eth.net.getId();					
		  let deployedNetwork = ngmi.networks[networkId];
		  const ngmiInstance = new web3.eth.Contract(
			ngmi.abi,
			deployedNetwork && deployedNetwork.address,
		  );														     //set this.state({contract})

		  this.setState({ web3, accounts, contract: ngmiInstance}, this.runExample);
		} catch (error) {
		  // Catch any errors for any of the above operations.
		  alert(
			`Failed to load web3, accounts, or contract. Check console for details.`,
		  );
		  console.error(error);
		}
	  };

		 mintToken = async (address) => {
			const { accounts, contract } = this.state;

			await contract.methods.["getToken"]().send({ from: accounts[0]});
			const ngmiResponse = await contract.methods.["getToken"]().call();

			this.setState({ storageValue: ngmiResponse});
			};

		 addressReceipt(address){
			this.mintToken(this.state.faucetAddress);
		}




	render(){
		  if (!this.state.web3) return <div>Wait a fucking moment, please - web3s bitch ass is still loading...</div>;
          return (
           <div>
				<WhitePaper mint = {this.mintToken} address = {this.addressReceipt} accounts = {this.state.accounts}/>
		   </div>
          )
       }
}

export default App;
