import { h, Component } from 'preact';
import Helmet from 'preact-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';

import style from './style.scss';
import { logIn } from '../../actions/user';
import { route } from 'preact-router';
import { getTransactions } from '../../actions/user';
import Transactions from '../../components/profile/transactions';
import Pagination from '../../components/profile/pagination';
const MAX_ITEMS = 10;



class AllTransactions extends Component {

	constructor(props) {
		super(props);
		this.state = {
			cutTransactions : [],
			currentPage: 1,
			loading: false
		}

		this.nextPage = this.nextPage.bind(this);
		this.previousPage = this.previousPage.bind(this);
		this.changePage = this.changePage.bind(this);
		this.changeTransactionsPage = this.changeTransactionsPage.bind(this);

	}
	componentDidMount(){
		if (typeof this.props.userData.userAuth != 'undefined') {
			this.setState({
				loading: true
			})
			this.props.getTransactions(this.props.userData.userAuth);
		}

}

	nextPage(){
		this.setState({
			 currentPage: this.state.currentPage + 1
		});
		this.changeTransactionsPage(this.state.currentPage );
	}
	previousPage(){
		this.setState({
			currentPage: this.state.currentPage - 1
		});
		this.changeTransactionsPage(this.state.currentPage );
	}
	changePage(page) {
		this.setState({
			currentPage: page
		});
		this.changeTransactionsPage(page);
	}
	changeTransactionsPage(page){
		this.setState({
			cutTransactions: this.props.transactions.slice( (page - 1) * MAX_ITEMS,  page * MAX_ITEMS)
		})
	}

	componentWillReceiveProps(nextProps) {
		if ( typeof nextProps.userData.userAuth != 'undefined' && (nextProps.userData.userAuth != this.props.userData.userAuth)	) {
			this.setState({
				loading: true
			})
			this.props.getTransactions(nextProps.userData.userAuth);
		} else {
			this.setState({
				loading: false
			})
		}

		if (nextProps.transactions.length  > 0) {
			this.setState({
				loading: false
			})
			this.setState({
				cutTransactions: nextProps.transactions.slice( (this.state.currentPage - 1) * MAX_ITEMS,  this.state.currentPage * MAX_ITEMS)
			})
		}

	}
	render() {
		const user = this.props.userData;
		return (
			<div id="profile" className="uk-container uk-container-small" >
				<h1>Money</h1>
				<Transactions transactions = { this.state.cutTransactions } loading = { this.state.loading }/>
				<Pagination
					list = { this.props.transactions }
					changePage = { this.changePage }
					nextPage = { this.nextPage }
					previousPage = { this.previousPage }
					currentPage = { this.state.currentPage }

					max = {MAX_ITEMS}
					/>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	userData: state.loggedInUser,
	transactions: state.loggedInUserTransactions
});

const mapDispatchToProps = dispatch => bindActionCreators({
	getTransactions
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AllTransactions);
