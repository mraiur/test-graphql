import jquery from 'jquery';
import Bootstrap from 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import gql from 'graphql-tag';
//import InfiniteScroll from 'react-infinite-scroll-component';
import ApolloClient from "apollo-boost";

const getUserPage = gql`
query ($pageSize: Int!, $search: String, $offset: Int) {
  users(pageSize: $pageSize, search: $search, offset: $offset){
	id,
	firstName
	lastName
  }
}`;

const countUsers = gql`
query ($search: String) {
  countUsers(search: $search)
}`;


const rowHeight = 49;
const pageSize = 50;

const client = new ApolloClient({
	uri: "/graphql"
});

import './app.scss';

class App extends React.Component{
	constructor(props)
	{
		super(props);
		this.state = {
			firstName: '',
			pages: [],
			page: 1,
			total: 0
		};
	}

	onFirstNameChange(ev){
		this.setState({
			firstName: ev.target.value,
			total: 0,
			page: 1,
			pages: []
		}, () => {
			this.getCount();
		});
	}

	getCount(){
		client.query({
			query: countUsers,
			variables: {
				search: this.state.firstName
			}
		})
		.then( result => {
			this.setState({
				total: result.data.countUsers
			});
			this.loadPage(1);
		});
	}

	loadPage( page ){
		console.log('load page', page);
		let offset = (page-1) * pageSize;

		client.query({
			query: getUserPage,
			variables: {
				pageSize: pageSize,
				offset: offset,
				search: this.state.firstName
			}
		})
		.then( result => {
			let pages = this.state.pages;
			pages[page] = result.data.users;
			this.setState({
				pages: pages
			});
		});
	}

	onItemsScroll(ev){

		let offsetRows = Math.ceil(ev.currentTarget.scrollTop / rowHeight);
		let page = Math.ceil(offsetRows / pageSize );
		if(!this.state.pages[page])
		{
			this.loadPage( page );
		}

		if( this.state.page !== page )
		{
			this.setState({ page: page });
		}
	}

	componentDidMount() {
		this.getCount();
	}

	renderPage(page)
	{//TODO move to a view component
		let users = [];
		if( this.state.pages[page])
		{
			users = this.state.pages[page].map( (item, index)=> {
				let style = {
					top: ((((page-1) * pageSize)+index)*rowHeight)+"px"
				};
				return (
					<div className="row user" key={'item-' + item.id} style={style}>
						<div className="col-sm-4">{item.id}</div>
						<div className="col-sm-4">{item.firstName}</div>
						<div className="col-sm-4">{item.lastName}</div>
					</div>
				);
			})
		}
		return users;
	}

	render()
	{
		return (
			<div className="container-fluid d-flex h-100 flex-column">
				<div className="row flex-shrink-0">
					<div className="col-sm-4">id</div>
					<div className="col-sm-4">Firstname <input type="string" name="firstName" value={this.state.firstName} onChange={this.onFirstNameChange.bind(this)} /></div>
					<div className="col-sm-4">Lastname</div>
				</div>
				<div className="row  flex-fill d-flex justify-content-start overflow-auto items-container" onScroll={this.onItemsScroll.bind(this)}>
					<div className="row items" ref='items' style={{height: (this.state.total * rowHeight)+"px"}}>
						{this.renderPage(this.state.page-1)}
						{this.renderPage(this.state.page)}
						{this.renderPage(this.state.page+1)}
					</div>
				</div>
			</div>
		);
	}
}
ReactDOM.render(<App/>, document.getElementById('app'));
