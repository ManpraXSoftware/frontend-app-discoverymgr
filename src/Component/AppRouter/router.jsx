import { Route } from "react-router-dom/cjs/react-router-dom.min";
import { Switch } from "react-router-dom/cjs/react-router-dom.min";
import { useContext } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import Dashboard from "../Dashboard/dashoard";
import Homepage from "../Home/home";
import { Courses, CourseCreate } from "../Courses";
import Programs from "../Programs/programs";
import CreateProgram from "../Programs/create_programs";
import EditProgram from "../Programs/editProgram";

const AppRouter = () => {
    var _useContext = useContext(AppContext);
    return (
        <Switch>
            <Route exact path='/'><Dashboard /></Route>
            <Route exact path='/home' ><Homepage /></Route>
            <Route exact path='/courses'><Courses /></Route>
            <Route exact path='/courses/create'><CourseCreate /></Route>
            <Route exact path='/programs'><Programs /></Route>
            <Route exact path='/createProgram'><CreateProgram /></Route>
            <Route path='/editProgram/:uuid'><EditProgram /></Route>

        </Switch>
    )
};
export default AppRouter;
