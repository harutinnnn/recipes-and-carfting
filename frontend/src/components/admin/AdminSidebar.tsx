import {Link} from "react-router-dom";
import {Apple, Bean, CookingPot, Factory, Gauge, House, LogOut, PawPrint, Settings, Sprout, Users} from "lucide-react";

export const AdminSidebar = () => {


    return (
        <div className={"admin-sidebar"}>

            <ul className={"admin-sidebar-nav"}>

                <li>
                    <Link to={'/admin'}>
                        <Gauge size={18}/>
                        <span>Dashboard</span>
                    </Link>
                </li>

                <li>
                    <Link to={'/admin/seeds'}>
                        <Bean size={18}/>
                        <span>Seeds</span>
                    </Link>
                </li>

                <li>
                    <Link to={'/admin/plants'}>
                        <Sprout size={18}/>
                        <span>Plants</span>
                    </Link>
                </li>


                <li>
                    <Link to={'/admin/animals'}>

                        <PawPrint size={18}/>
                        <span>Animals</span>
                    </Link>
                </li>

                <li>
                    <Link to={'/admin/factories'}>
                        <Factory size={18}/>
                        <span>Factories</span>
                    </Link>
                </li>
                <li>
                    <Link to={'/admin/products'}>
                        <Apple size={18}/>
                        <span>Products</span>
                    </Link>
                </li>
                <li>
                    <Link to={'/admin/recipes'}>
                        <CookingPot size={18}/>
                        <span>Recipes</span>
                    </Link>
                </li>

                <li>
                    <Link to={'/admin/users'}>
                        <Users size={18}/>
                        <span>Users</span>
                    </Link>
                </li>

                <li>
                    <Link to={'/admin/settings'}>
                        <Settings size={18}/>
                        <span>Settings</span>
                    </Link>
                </li>


                <li>
                    <Link to={'/admin/logout'}>
                        <LogOut size={18}/>
                        <span>Log out</span>
                    </Link>
                </li>


            </ul>


        </div>
    )
}