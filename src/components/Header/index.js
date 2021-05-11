import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './style.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../actions';

/**
* @author
* @function Header
**/

const Header = (props) => {

	const auth = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const setBg = () => {
		return Math.floor(Math.random()*16777215).toString(16);
		// document.body.style.backgroundColor = "#" + randomColor;
		// color.innerHTML = "#" + randomColor;
	  }
	return (
		<header className="header" style={{background: `radial-gradient(#${setBg()}, #000000b0)`}}>
			<div style={{ display: 'flex' }}>
				<div className="logo">WebChat Room</div>
				{
					!auth.authenticated ?
						<ul className="leftMenu">
							<li><NavLink to={'/login'}>Login</NavLink></li>
							<li><NavLink to={'/signup'}>Sign up</NavLink></li>
						</ul> : null
				}
			</div>
			<div style={{ display: 'flex', alignItems: 'center', color: '#fff', fontWeight: 'bold' }}>
				{auth.authenticated ? `Hi,  ${auth.firstName} ${auth.lastName}` : ''}
			</div>
			<ul className="menu">
				{
					auth.authenticated ?
						<li>
							<Link to={'#'} onClick={() => {
								dispatch(logout(auth.uid))
							}}>Logout</Link>
						</li> : null
				}
			</ul>
		</header>
	)
}

export default Header