import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';
import LandingFAQ from '../../components/new-landing/landing-faq'
import Spinner from '../../components/global/spinner';
import { route } from 'preact-router';

import { processFAQPageData, getPage } from '../../utils/prismic-middleware';
import { changeLocaleLangs, changeLocale } from '../../actions/user';


class FAQ extends Component {
	constructor(props){
		super(props);
		this.state =  {
		  page: null,
		  fetchingPage: true
		}
	}

	componentDidMount(){
		this.props.prismicCtx && this.fetchPage(this.props);
	}

	componentWillReceiveProps(nextProps){
		((this.props.prismicCtx == null && nextProps.prismicCtx != null) 
			|| this.props.locale !== nextProps.locale
			|| (this.props.path !== nextProps.path))
			&& this.fetchPage(nextProps);
	}

	fetchPage = async (props) => {
		window.scrollTo(0, 0);
		this.props.changeLocaleLangs([]);
		this.setState({fetchingPage: true,});

		const page = await getPage(props);
		page && this.setState({fetchingPage: false, page: processFAQPageData(page.data)});

	};
	
	render(){
		if (!this.state.fetchingPage) {
			const pageData = this.state.page;

			return (<div class='uk-container uk-container-small' style={{paddingTop: 50}}>
				<LandingFAQ {...pageData} locale={this.props.locale}/>
			</div>)	
		}

		return (
			<div  className="uk-container uk-container-small">
			  <Spinner />
			</div>
		);
		
	}
}

const mapStateToProps = (state) => ({
	locale: state.locale.locale,
});

const mapDispatchToProps = dispatch => bindActionCreators({
	changeLocaleLangs,
	changeLocale,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FAQ);