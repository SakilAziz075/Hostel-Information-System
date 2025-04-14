import './Navbar.css';
import logo from '../assets/nilchalLogo.png' 

const Navbar= () =>{

    return(
        <nav className='navbar'>
            <div className="navbar-brand"><img src={logo} alt='Nilachal Logo'/></div>

            <ul className="navbar-menu">
                <li><a href="#">Home</a></li>
                <li><a href="#">Administration</a></li>
                <li><a href="#">Achivements</a></li>
                <li><a href="#">Boarders</a></li>
                <li><a href="#">Gallery</a></li>
                <li><a href="#">Facilities</a></li>
                <li><a href="#">Contact Us</a></li>
            </ul>
        </nav>
    )
}

export default Navbar;