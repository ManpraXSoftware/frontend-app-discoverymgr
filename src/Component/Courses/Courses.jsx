import { fetchAuthenticatedUser, getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { Button, Card, CardGrid, Container, Pagination, Row, breakpoints, useMediaQuery } from '@edx/paragon';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const isSmall = useMediaQuery({ maxWidth: breakpoints.small.maxWidth });
    const getCourses = async (pageNumber) => {
        const authenticatedUser = await fetchAuthenticatedUser(); // validates and decodes JWT token
        const response = await getAuthenticatedHttpClient().get(`${process.env.LMS_BASE_URL}/api/courses/v1/courses/?username=${authenticatedUser.username}&page=${pageNumber}`); // fetching from an authenticated API using user data
        setCourses(response.data.results);
        setTotalPages(response.data.pagination.num_pages);
        setCurrentPage(pageNumber);
    }
    useEffect(
        () => {
            getCourses(1);
        }, []
    )
    return <Container>
        <Row as={Container} className='justify-content-between mt-5'><h1>Courses</h1><Button as={Link} to="/courses/create" >Create</Button></Row>
        <CardGrid className="mb-5">
            {
                // courses.map((value, index) => <Card className="mt-5" orientation={isSmall ? "vertical" : "horizontal"}>
                courses.map((value, index) => <Card className="m-3" orientation={"vertical"}>
                    <Card.ImageCap
                        src={value.media.banner_image.uri_absolute}
                        srcAlt="Course image"
                    />
                    <Card.Body>
                        <Card.Section>
                            <h2>{value.name}</h2>
                            <p>{value.short_description}</p>
                        </Card.Section>
                    </Card.Body>
                    <Card.Footer className="justify-content-end">
                        <Button variant="link">Edit</Button>
                    </Card.Footer>
                </Card>)
            }
        </CardGrid>
        <Pagination
            paginationLabel="Course List Pagination"
            pageCount={totalPages}
            currentPage={currentPage}
            onPageSelect={(page) => getCourses(page)}
        />

    </Container>
}

export default Courses;
