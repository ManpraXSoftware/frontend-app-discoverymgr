import { fetchAuthenticatedUser, getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { Button, Card, CardGrid, Col, Container, Form, Pagination, Row, breakpoints, useMediaQuery } from '@edx/paragon';
import React, { useEffect, useState } from 'react';


const CourseCreate = () => {
    const [courses, setCourses] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const isSmall = useMediaQuery({ maxWidth: breakpoints.small.maxWidth });
    // const getCourses = async (pageNumber) => {
    //     const authenticatedUser = await fetchAuthenticatedUser(); // validates and decodes JWT token
    //     const response = await getAuthenticatedHttpClient().get(`${process.env.LMS_BASE_URL}/api/courses/v1/courses/?username=${authenticatedUser.username}&page=${pageNumber}`); // fetching from an authenticated API using user data
    //     setCourses(response.data.results);
    //     setTotalPages(response.data.pagination.num_pages);
    //     setCurrentPage(pageNumber);
    // }
    const createCourse = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        getAuthenticatedHttpClient().post(`http://studio.local.overhang.io:8001/course/`, data);
    }
    // useEffect(
    //     () => {
    //         getCourses(1);
    //     }, []
    // )
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
