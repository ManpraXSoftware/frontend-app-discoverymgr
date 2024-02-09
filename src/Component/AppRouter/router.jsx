import { Route } from "react-router-dom/cjs/react-router-dom.min";
import { Switch } from "react-router-dom/cjs/react-router-dom.min";
import Dashboard from "../Dashboard/dashoard";
import Homepage from "../Home/home";
import { Courses, CourseCreate } from "../Courses";

const AppRouter = () => (
    <Switch >
        <Route exact path='/'><Dashboard /></Route>
        <Route exact path='/home' ><Homepage /></Route>
        <Route exact path='/courses'><Courses /></Route>
        <Route exact path='/courses/create'><CourseCreate /></Route>
    </Switch>
)
export default AppRouter;
