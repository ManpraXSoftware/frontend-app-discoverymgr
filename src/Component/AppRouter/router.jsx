import { Route } from "react-router-dom/cjs/react-router-dom.min";
import { Switch } from "react-router-dom/cjs/react-router-dom.min";
import { useContext } from 'react';
import { AppContext, Redirect } from '@edx/frontend-platform/react';
import Dashboard from "../Dashboard/dashoard";
import Homepage from "../Home/home";
import { Courses, CourseCreate, CourseEdit } from "../Courses";
import Programs from "../Programs/programs";
import CreateProgram from "../Programs/create_programs";
import EditProgram from "../Programs/editProgram";
import Degrees from "../Degree/degrees";
import CreateDegree from "../Degree/createDegree";
import UpdateDegree from "../Degree/updateDegree";
import { getLoginRedirectUrl } from "@edx/frontend-platform/auth";

const AppRouter = () => {
    var _useContext = useContext(AppContext);
    console.log("AAAAAAAAAAAAAAAAA",getLoginRedirectUrl())
    return (
        <Switch>
            {_useContext.authenticatedUser != null?<>
            <Route exact path='/'><Dashboard /></Route>
            <Route exact path='/home' ><Homepage /></Route>
            <Route exact path='/courses'><Courses /></Route>
            <Route exact path='/courses/create'><CourseCreate /></Route>
            <Route exact path='/programs'><Programs /></Route>
            <Route exact path='/createProgram'><CreateProgram /></Route>
            <Route exact path='/courses/:course_id/edit'><CourseEdit /></Route>
            <Route path='/editProgram/:uuid'><EditProgram /></Route>
            <Route exact path='/degrees'><Degrees /></Route>
            <Route exact path='/createDegree'><CreateDegree /></Route>
            <Route path='/editDegree/:uuid'><UpdateDegree /></Route></>
            :''}

        </Switch>
    )
};
export default AppRouter;
