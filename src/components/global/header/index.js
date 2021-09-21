import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import * as router from 'preact-router';
import style from './style.scss';
import Search from '../search';
import Select from './select';
import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';
import { hideSearchBox } from '../../../actions';
import { apiRoot } from '../../../api';
import { logIn, logOff, changeLocale } from '../../../actions/user';
import FontAwesome from 'react-fontawesome';
import Redirect from '../redirect';
import { Link as ScrollLink } from 'react-scroll'
import { routes, langRoutes } from '../../app'
import { langPack } from '../../../utils/langPack';
import { EN, RU, langs } from '../../../utils/consts';
import { processGlobalMessage } from '../../../utils/prismic-middleware'


const getCookie = (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedOff: false,
      mobileMenuOpened: false,
      isTop: true,
      globalMessage: null,
    }
  };

  componentWillReceiveProps(nextProps){
    if (typeof this.props.userAuth != 'undefined' && typeof nextProps.userAuth != 'undefined') {
      if (Object.keys(this.props.userAuth).length != 0 && Object.keys(nextProps.userAuth).length === 0) {
        this.setState({
          loggedOff: true
        })
      } else {
        this.setState({
          loggedOff: false
        })
      }
    }

    ((this.props.prismicCtx == null && nextProps.prismicCtx != null) 
			|| this.props.uid !== nextProps.uid)
			&& this.fetchPage(nextProps);
  };

	componentDidMount(){
    let that = this;
    window.addEventListener('scroll', this.handleScroll);
    router.subscribers.push(()=>{
      that.setState({
        mobileMenuOpened: false
      })
    });

    this.props.prismicCtx && this.fetchPage(this.props);

		{/*let userAuth = getCookie('USER_AUTH');
		if (userAuth != null) {
			this.props.logIn(userAuth)
    }*/}
  };

  fetchPage = (props) => {
		let that = this;
		props.prismicCtx.api.getByID(props.uid).then((page, err) => {
		  page && that.setState({ globalMessage: processGlobalMessage(page.data) });
		});
	};

  componentWillUnmount(){
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (e) => {
    (window.pageYOffset || document.documentElement.scrollTop) ?
      this.state.isTop && this.setState({isTop: false})
      : !this.state.isTop && this.setState({isTop: true});
  }
  
  logOff(){
    this.setState({
      loggedOff: true
    });
    this.props.logOff();
  };

  toggleMobileMenu = () => this.setState(prev => ({mobileMenuOpened: !prev.mobileMenuOpened}));

	render() {
    const {userData : user  = {}, locale : localeObj} = this.props;
    const { locale = EN, languages } = localeObj;
    const isLogin = Object.keys(user).length !== 0;
    const isAtHome = this.props.currentUrl === routes.HOME 
      || this.props.currentUrl === langRoutes(RU, routes.HOME)
      || this.props.currentUrl.toString().indexOf('/#') === 0;
    const isAtBlog = this.props.currentUrl === routes.BLOG
      || !!(this.props.currentUrl.indexOf('/blog') + 1);
    const isServicePage = !!(this.props.currentUrl.toString().indexOf(routes.IMMIGRATION_LAW) + 1)
      || !!(this.props.currentUrl.toString().indexOf(routes.LANGUAGE_PRACTICE ) + 1)
      || !!(this.props.currentUrl.toString().indexOf(routes.LANGUAGE_LEARNERS) + 1);
    const { globalMessage } = this.state;

		return (
      <header class={`uk-navbar uk-navbar-container ${!this.state.isTop && style.smallHeader} ${globalMessage && 'globalMessage'}`} 
          style={{width: "100%", position: 'fixed', zIndex: 200, margin: '0 auto', top: 0, display: "flex", flexWrap: "wrap"}}>
        <div id={style.header}>

          <div id={style.mobileShadow} className={this.state.mobileMenuOpened ? style.opened : ''} onClick = {this.toggleMobileMenu}></div>
          <div class={`${style.navbarLeft} uk-navbar-left`} >
            { this.state.loggedOff && (
              <Redirect to='/' />
            )}


            <Link href={langRoutes(langs[locale].lang, routes.HOME)} id={style.logo}>
              <img src="/assets/logo.png" alt="Telmie App"/>
            </Link>
            { isAtBlog ? <b class={style.title}>{langPack[locale].BLOG_TITLE}</b> : null }

            { isServicePage && <Select locale={locale} curUrl={this.props.currentUrl} /> }

            {!(isServicePage || isAtBlog) ?
                <span id={style.expandMobileMenu} class={this.state.mobileMenuOpened ? style.opened : ''} onClick = { this.toggleMobileMenu }>
                <span></span>
                <span></span>
                <span></span>
              </span>
              : null
            }

            <ul className="uk-navbar-nav" id={style.leftNav}>
              {
                /*isLogin ? ([
                  (user.pro != null) && (<li><Link activeClassName={style.activeLink} href={routes.MY_CLIENTS}>My Clients</Link></li>),
                  <li><Link activeClassName={style.activeLink} href={routes.MY_PROS}>My Pros</Link></li>,
                  <li><Link activeClassName={style.activeLink} href={routes.TRANSACTIONS}>Money</Link></li>,
                  (user.pro == null) && (<li><Link activeClassName={style.activeLink} href={routes.REGISTER_PRO}>Become a Pro</Link></li>)
                ]) : */
                isServicePage ? null : ([
                  <li>{isAtHome ?
                    <ScrollLink spy={true} smooth={true} offset={globalMessage ? -120 : -50} duration={500} to="howWorksElement">{langPack[locale].HEADER.HOW_IT_WORKS}</ScrollLink> 
                    : <Link href={langRoutes(langs[locale].lang, routes.HOW_WORKS_LINK)}>{langPack[locale].HEADER.HOW_IT_WORKS}</Link>}
                  </li>,
                  langPack[locale].HEADER.BECOME_PRO && <li>{(isAtHome) ? 
                    <ScrollLink spy={true} smooth={true} offset={globalMessage ? -180 : -110} duration={500} to="becomeProElement">{langPack[locale].HEADER.BECOME_PRO}</ScrollLink> 
                    : <Link href={langRoutes(langs[locale].lang, routes.BECOME_PRO_LINK)}>{langPack[locale].HEADER.BECOME_PRO}</Link>}
                  </li>,
                  <li>{isAtHome ? 
                    <ScrollLink spy={true} smooth={true} offset={globalMessage ? -120 : -70} duration={500} to="blogElement">{langPack[locale].HEADER.BLOG}</ScrollLink> 
                    : <Link href={langRoutes(langs[locale].lang, routes.BLOG_LINK)}>{langPack[locale].HEADER.BLOG}</Link>}
                  </li>,
                  <li>{isAtHome ? 
                    <ScrollLink spy={true} smooth={true} duration={500} offset={globalMessage ? -120 : -70} to="FAQElement">{langPack[locale].HEADER.FAQ}</ScrollLink> 
                    : <Link href={langRoutes(langs[locale].lang, routes.FAQ)}>{langPack[locale].HEADER.FAQ}</Link>}
                  </li>,
                  <li>{isAtHome ? 
                    <ScrollLink spy={true} smooth={true} duration={500} offset={globalMessage ? -50 : 0} to="contactUsElement">{langPack[locale].HEADER.CONTACT}</ScrollLink> 
                    : <Link href={langRoutes(langs[locale].lang, routes.CONTACT_US)}>{langPack[locale].HEADER.CONTACT}</Link>}
                  </li>
                ])
              }
              
            </ul>
          </div>

          <div class={`${style.navbarRight} uk-navbar-right`}>
          
              <Select isLocale={true} locale={locale} changeLocale={this.props.changeLocale} languages={languages} />
            { /*currentUrl != '/' && (
                <Search hiddenSearchBox = {this.props.hiddenSearchBox} 
                  hideSearchBox = { this.props.hideSearchBox } 
                  isLogin = {isLogin} 
                  home= { false }/>
            )*/}

            {/* !isLogin  ? (
              <nav>
                <ul className="uk-navbar-nav" >
                  <li><Link href={routes.SIGN_UP} id={style.signUp}>Sign up</Link></li>
                  <li><Link href={routes.LOG_IN}>Login</Link></li>
                </ul>
              </nav>
            ) : (
              <div className={style.loggedInContainer}>
                <div className="mobile-hide">
                  { user.name } { user.lastName }
                </div>
                <FontAwesome name='caret-down' />
                <div className={style.avatar}>

                  {(user.avatar != null) ? (
                    <img src={apiRoot + 'image/' + user.avatar.id} alt={user.name + ' ' + user.lastName} />
                  ) : (
                    <img src="/assets/nouserimage.jpg" alt={user.name + ' ' + user.lastName} />
                  )}

                </div>
                <div className={style.dropdown + ' uk-dropdown'}>
                    <ul className="uk-nav uk-dropdown-nav">
                        {/*<li><Link href="/profile">My Account</Link></li>
                        <li><Link href="/my-pros">My Pros</Link></li>
                        {(user.pro != null) && (
                            <li><Link href="/my-clients">My Clients</Link></li>
                        )}
                        <li><Link href="/my-shortlist">My Shortlist</Link></li>
                        <li><Link href="/transactions">Money</Link></li>
                        <li><Link href="/edit-profile">Edit Profile</Link></li>
                        <li><Link href="/register-pro">Register as Pro</Link></li>
                        <li className="uk-nav-divider"></li>
                        <li><Link href="/edit-profile">Edit Profile</Link></li>
                        <li className="uk-nav-divider"></li>*/}
                        {/*<li><Link href={routes.SETTINGS}>Settings</Link></li>
                        <li><a onClick={()=>this.logOff()}>Log out</a></li>
                    </ul>
                </div>

              </div>
            )}*/}
          </div>
          <div id={style.mobileNav} className={this.state.mobileMenuOpened ? style.opened : ''}>
            <div class={style.mobileNavHeader}>
            <Link href={langRoutes(langs[locale].lang, routes.HOME)} id={style.logo}>
              <img src="/assets/logo.png" alt="Telmie App"/>
            </Link>
            <span id={style.expandMobileMenu}  className={this.state.mobileMenuOpened ? style.opened : ''} onClick = { this.toggleMobileMenu }>
              <span></span>
              <span></span>
              <span></span>
            </span>
            </div>

            {isAtHome ?
              <ScrollLink spy={true} smooth={true} offset={globalMessage ? -90 : -30} duration={500} to="howWorksElement" onClick={this.toggleMobileMenu}>{langPack[locale].HEADER.HOW_IT_WORKS}</ScrollLink>
              : <Link href={langRoutes(langs[locale].lang, routes.HOW_WORKS_LINK)} onClick={this.toggleMobileMenu}>{langPack[locale].HEADER.HOW_IT_WORKS}</Link>
            }
            {( isAtHome && langPack[locale].HEADER.BECOME_PRO ) ?
              <ScrollLink spy={true} smooth={true} offset={globalMessage ? -130 : -70} duration={500} to="becomeProElement" onClick={this.toggleMobileMenu}>{langPack[locale].HEADER.BECOME_PRO}</ScrollLink>
              : <Link href={langRoutes(langs[locale].lang, routes.BECOME_PRO_LINK)} onClick={this.toggleMobileMenu}>{langPack[locale].HEADER.BECOME_PRO}</Link>
            }
            {isAtHome ?
              <ScrollLink spy={true} smooth={true} offset={globalMessage ? -100 : -25} duration={500} to="blogElement" onClick={this.toggleMobileMenu}>{langPack[locale].HEADER.BLOG}</ScrollLink>
              : <Link href={langRoutes(langs[locale].lang, routes.BLOG_LINK)} onClick={this.toggleMobileMenu}>{langPack[locale].HEADER.BLOG}</Link>
            }
            {isAtHome ?
                <ScrollLink spy={true} smooth={true} offset={globalMessage ? -100 : -30} duration={500} to="FAQElement" onClick={this.toggleMobileMenu}>{langPack[locale].HEADER.FAQ}</ScrollLink>
                : <Link href={langRoutes(langs[locale].lang, routes.FAQ)} onClick={this.toggleMobileMenu}>{langPack[locale].HEADER.FAQ}</Link>
            }
            {isAtHome ?
              <ScrollLink spy={true} smooth={true} offset={globalMessage ? -60 : 0} duration={500} to="contactUsElement" onClick={this.toggleMobileMenu}>{langPack[locale].HEADER.CONTACT}</ScrollLink>
              : <Link href={langRoutes(langs[locale].lang, routes.CONTACT_US)} onClick={this.toggleMobileMenu}>{langPack[locale].HEADER.CONTACT}</Link>
            }
                
            {/* !isLogin  ? (
              <div>
                <h3>My account</h3>
                <Link href={routes.SIGN_UP} id={style.signUp}>Sign up</Link>
                <Link href={routes.LOG_IN}>Login</Link>
              </div>
            ) : (
              <div>
                {/*<Link href="/profile">My Account</Link>
                <Link href="/my-pros">My Pros</Link>
                {(user.pro != null) && (
                    <Link href="/my-clients">My Clients</Link>
                )}
                <Link href="/my-shortlist">My Shortlist</Link>
                <Link href="/transactions">Money</Link>
                <Link href="/edit-profile">Edit Profile</Link>
                <Link href="/register-pro">Register as Pro</Link>
                <Link href="/edit-profile">Edit Profile</Link>*/}
                {/*{(user.pro != null) && <Link activeClassName={style.activeLink} href={routes.MY_CLIENTS}>My Clients</Link>}
                <Link activeClassName={style.activeLink} href={routes.MY_PROS}>My Pros</Link>
                <Link activeClassName={style.activeLink} href={routes.TRANSACTIONS}>Money</Link>
                {(user.pro == null) && <Link activeClassName={style.activeLink} href={routes.REGISTER_PRO}>Become a Pro</Link>}
                <Link activeClassName={style.activeLink} href={routes.SETTINGS}>Settings</Link>
                <a onClick={()=>this.logOff()}>Log out</a>
              </div>
            )}*/}

          </div>
        </div>

        { globalMessage && (
          <div id={style.subHeader}>
              <div class={style.content}> { globalMessage } </div>
          </div>
        )}
			</header>
		);
	}
}




const mapStateToProps = (state) => ({
	hiddenSearchBox: state.hiddenSearchBox,
  userData: state.loggedInUser,
  locale: state.locale,
});


const mapDispatchToProps = dispatch => bindActionCreators({
	hideSearchBox,
	logIn,
  logOff,
  changeLocale,
}, dispatch);


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Header);
