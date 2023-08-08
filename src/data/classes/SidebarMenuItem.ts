export default class SidebarMenuItem {
    name: string;
    link: string;
constructor({
    name,
    link 
}: {
    name: string;
    link: string;
}) {
    this.name = name;
    this.link = link;
}
}