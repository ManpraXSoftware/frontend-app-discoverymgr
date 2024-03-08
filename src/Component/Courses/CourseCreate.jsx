import { fetchAuthenticatedUser, getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { Button, Card, CardGrid, Col, Container, Form, Row, breakpoints, useMediaQuery } from '@edx/paragon';
import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


const CourseCreate = () => {
    const history = useHistory()
    const createCourse = async (e) => {
        e.preventDefault();
        const data = {
            "display_name": e.target.display_name.value,
            "org":e.target.org.value,
            "number":e.target.number.value,
            'run':e.target.run.value
        }
        console.log("aaaaaaaa", e.target.display_name.value)
        const response = await getAuthenticatedHttpClient().post('http://studio.local.overhang.io:8001/course/', data);
        if (response.status==200){
            history.push('/courses')
        }
    }
    return <Container>
        <Row as={Container} className='justify-content-between mt-5'><h1>Create New Course</h1></Row>
        <Form onSubmit={createCourse}>

            <Form.Group controlId="formGridCourseName">
                <Form.Control name='display_name' floatingLabel="Course Name*" />
            </Form.Group>

            <Form.Group controlId="formGridOrganization">
                <Form.Control name='org' floatingLabel="Organization*" />
            </Form.Group>

            <Form.Group controlId="formGridCourseNumber" isValid>
                <Form.Control name='number' floatingLabel="Course Number*" />
            </Form.Group>

            <Form.Group controlId="formGridCourseRun">
                <Form.Control name='run' floatingLabel="Course Run*" />
            </Form.Group>

            <div className="d-flex">
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </div>
        </Form>

    </Container>
}

export default CourseCreate;
