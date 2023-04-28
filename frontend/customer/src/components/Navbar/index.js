import React, { useState } from 'react';

import classes from './Navbar.module.css';
import { NavLink } from 'react-router-dom';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import LoginForm from '../LoginForm';

const Navbar = () => {
    const activeLink = ({ isActive }) => `${classes.link}${(isActive) ? ` ${classes.active}` : ''}`;

    const [showLogin, setShowLogin] = useState(false);

    return <>
        { showLogin && <LoginForm closeForm={() => setShowLogin(false)} /> }
        <nav className={classes.navbar}>
            <NavLink to='/' className={`${classes.title} ${classes.link}`}>Bus Ticket Booking</NavLink>

            <div className={`${classes.main}`}>
                <NavLink to='/' className={activeLink}>Trang chủ</NavLink>
                <NavLink to='/schedules' className={activeLink}>Lịch trình</NavLink>
                <NavLink to='/branches' className={activeLink}>Bến xe</NavLink>
                <NavLink to='/about' className={activeLink}>Giới thiệu</NavLink>
            </div>

            <div className={classes.foot}>
                <Button className={classes.contact_btn} outline>
                    <FontAwesomeIcon className={classes.phoneIcon} icon={faPhone} />
                    <span>Liên hệ</span>
                </Button>
                <Button onClick={() => setShowLogin(true) }>Đăng nhập</Button>
            </div>
        </nav>
    </>
}

export default Navbar;