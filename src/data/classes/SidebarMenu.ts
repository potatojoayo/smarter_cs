import type SidebarMenuItem from "./SidebarMenuItem";

export default class SidbarMenu {
	name: string;
    subMenus: Array<SidebarMenuItem>;
	link: string;


	constructor({
		name,
        subMenus,
		link
	}: {
		name: string;
        subMenus: Array<SidebarMenuItem>;
		link: string;

	}) {
        this.name = name;
        this.subMenus = subMenus;
		this.link = link;
	}
}
