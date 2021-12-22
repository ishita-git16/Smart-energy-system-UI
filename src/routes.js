import PanelList from "./Components/Panel/PanelList";
import PanelEdit from "./Components/Panel/PanelEdit";
import PanelAdd from "./Components/Panel/PanelAdd";
import Allheartbeats from "./Components/Heartbeat/Allheartbeats";
import LocationList from "./Components/Location/LocationList";
import AddSite from "./Components/Location/Site/AddSites";
import LocationEdit from "./Components/Location/LocationEdit";
import Bar1 from "./Components/Dashboard/Bar";
import MainDashboard from "./Components/Dashboard/MainDashboard";

const routes = [
  { path: "/panel", name: "Panel", component: PanelList },
  { path: "/paneledit/:panelid", name: "Panel Edit", component: PanelEdit },
  { path: "/paneladd", name: "Panel Add", component: PanelAdd },
  { path: "/hbreports", name: "Heartbeat", component: Allheartbeats },
  { path: "/location", name: "Location", component: LocationList },
  { path: "/addsites", name: "Add Site", component: AddSite },
  {
    path: "/locationedit/:id",
    name: "Edit Location",
    component: LocationEdit,
  },
  { path: "/dashboard", name: "Dashboard", component: MainDashboard },
];
export default routes;
