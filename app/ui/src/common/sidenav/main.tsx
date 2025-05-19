import { NavLink } from "react-router-dom";

interface SideNavProps {
    routeActive: string;
}

const SideNav = (props: SideNavProps) => {

    if(props.routeActive === "apps") {
        document.querySelector("#apps-navigator")?.classList.add("active-nav-item");
    }
    else if(props.routeActive === "preferences") {
        document.querySelector("#preferences-navigator")?.classList.add("active-nav-item");
    }

    return(
        <div className="col-width-2 padding--small col-height-auto side-nav bg-body-dark">
            <NavLink id="apps-navigator" className="nav-item bg-body-dark text-body text--no-decoration" to={"/apps"}>
                <label>Apps List</label>
            </NavLink>
            <NavLink id="preferences-navigator" className="nav-item bg-body-dark text-body text--no-decoration" to={"/preferences"}>
                <label>Preferences</label>
            </NavLink>
        </div>
    )

}

export default SideNav;