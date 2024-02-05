import Header from '@edx/frontend-component-header';
import Footer from '@edx/frontend-component-footer';
import SideBar from '../Sidebar/sidebar';

  
const Layout = (props) => (
    <>
    <Header />
    <main className='flex-xl-nowrap row'>
    <SideBar/>
    {props.children}
    </main>
    <Footer />
    </>
)

export default Layout;