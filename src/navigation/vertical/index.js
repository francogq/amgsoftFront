/*

Array of object

Top level object can be:
1. Header
2. Group (Group can have navItems as children)
3. navItem

* Supported Options

/--- Header ---/

header

/--- nav Grp ---/

title
icon (if it's on top level)
tag
tagVariant
children

/--- nav Item ---/

icon (if it's on top level)
title
route: [route_obj/route_name] (I have to resolve name somehow from the route obj)
tag
tagVariant

*/
import dashboard from "./dashboard";
import appsAndPages from "./apps-and-pages";
import others from "./others";
import chartsAndMaps from "./charts-and-maps";
import uiElements from "./ui-elements";
import formAndTable from "./forms-and-table";
import crm from "@/views/crm/navigation/index";
import socialNetwork from "@/views/social-network/navigation";
import debtSolution from "@/views/debt-solution/navigation";
// Array of sections

let amgSections = [...debtSolution, ...socialNetwork, ...crm];
let sectionsToShow = [];
if (process.env.VUE_APP_ENVIROMENT != "deploy") {
  sectionsToShow = [
    ...amgSections,
    ...dashboard,
    ...appsAndPages,
    ...uiElements,
    ...formAndTable,
    ...chartsAndMaps,
    ...others,
  ];
} else {
  sectionsToShow = amgSections;
}

export default sectionsToShow;
