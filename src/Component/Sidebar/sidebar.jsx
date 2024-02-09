import { Collapsible } from '@edx/paragon';
import { FOUNDATION_PAGES, LANGUAGES } from '../Config/config';
import classNames from 'classnames';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
const { pathname } = window.location


const SideBar = () => (
    <div className="col-2">
        <div className="pgn__sticky pgn__sticky-top pgn__sticky-offset--6 pgn__sticky-shadow pgn-doc__toc p-0 pt-3">
            <div className="pgn-doc__menu">
                <div className="pgn-doc__menu-items">

                    <Collapsible
                        styling="basic"
                        title="Foundations"
                        defaultOpen={pathname.startsWith('/discoverymgr')}
                    >
                        <ul className="list-unstyled foundations-list">
                            {FOUNDATION_PAGES.map(({ label, path }) => (
                                <li key={path}>
                                    <Link
                                        className={classNames({ active: pathname.endsWith(path) })}
                                        to={path}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Collapsible>
                    <Collapsible
                        styling="basic"
                        title="Main"
                        defaultOpen={pathname.startsWith('/foundations')}
                    >
                        <ul className="list-unstyled foundations-list">
                            {LANGUAGES.map(({ label, path }) => (
                                <li key={path}>
                                    <Link
                                        className={classNames({ active: pathname.endsWith(path) })}
                                        to={path}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Collapsible>
                </div>
            </div>
        </div>
    </div>
);

export default SideBar;