import jquery from 'jquery';
import Bootstrap from 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';

import './app.scss';

const App = () => (
	<div>
		<h1>h1</h1>
		<table className="table">
			<thead>
			<tr>
				<th>Firstname</th>
				<th>Lastname</th>
				<th>Email</th>
			</tr>
			</thead>
			<tbody>
			<tr>
				<td>John</td>
				<td>Doe</td>
				<td>john@example.com</td>
			</tr>
			</tbody>
		</table>
	</div>
);

ReactDOM.render(<App/>, document.getElementById('app'));