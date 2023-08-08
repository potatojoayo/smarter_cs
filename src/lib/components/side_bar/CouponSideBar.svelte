<script>
    import SideBar from "./SideBar.svelte";
    import LgWhite from "../base/LgWhite.svelte";
	import LgGray from "../base/LgGray.svelte";
    let sidebarItems = [
        {
            name: '신규가입 쿠폰',
            link: '/customer'
        },
        {
            name: '추천인 쿠폰',
            link: '/new'
        },
        {
            name: '수동발행 쿠폰',
            link: '/coupon'
        },
    ];
    let subSidebarItems = [
        {
            name: '발급내역',
            link: '/customer'
        },
        {
            name: '사용내역',
            link: '/new'
        },
        {
            name: '설정',
            link: '/coupon'
        },
    ];
    let selectedItem = '신규가입 쿠폰';
    let selectedSubItem = '발급내역';

    const selectItem = (item) => {
        selectedItem = item.name;
        selectedSubItem = ''
    } 
</script>
<div class="flex">
    <SideBar {sidebarItems} {selectedItem} />
    <SideBar sidebarItems={subSidebarItems} selectedItem={selectedSubItem}/>
</div>

