import { fetchAuthenticatedUser, getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { Button, Card, CardGrid, Container, ModalDialog, Pagination, Row } from '@edx/paragon';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import Loader from '../Shared/Loader';
import CourseCreate from './CourseCreate';
import { getConfig } from '@edx/frontend-platform';


const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const { DISCOVERY_BASE_URL, STUDIO_BASE_URL } = getConfig();
    const [createModalData, setCreateModalData] = useState({ isOpen: false, source: "" })
    const getCourses = async (pageNumber) => {
        setLoading(true);
        const authenticatedUser = await fetchAuthenticatedUser(); // validates and decodes JWT token
        const response = await getAuthenticatedHttpClient().get(`${STUDIO_BASE_URL}/api/v1/course_runs/?username=${authenticatedUser.username}&page=${pageNumber}&&page_size=12`); // fetching from an authenticated API using user data
        setLoading(false);
        setCourses(response.data.results);
        setTotalPages(response.data.num_pages);
        setCurrentPage(pageNumber);
    }
    useEffect(
        () => {
            getCourses(1);

        }, []
    )
    return <Container >
        <ModalDialog isOpen={createModalData.isOpen} title="Create Course!" onClose={() => { setCreateModalData({ source: "", isOpen: false }) }} isBlocking={true}>
            <>
                <ModalDialog.Header>
                    <ModalDialog.Title>
                        Create Course
                    </ModalDialog.Title>
                </ModalDialog.Header>
                <ModalDialog.Body>
                    <CourseCreate source={createModalData.source} compact={true} />
                </ModalDialog.Body>
            </>
        </ModalDialog>
        <Row as={Container} className='justify-content-between mt-5'><h1>Courses</h1><Button onClick={() => { }} as={Link} to="/courses/create" >Create</Button></Row>
        <Loader hidden={!loading} />
        <CardGrid className="mb-5" hidden={loading}>
            {
                // courses.map((value, index) => <Card className="mt-5" orientation={isSmall ? "vertical" : "horizontal"}>
                courses.map((value) => <Card className="m-3 justify-content-between" orientation={"vertical"}>
                    <Card.ImageCap
                        src={value.images.card_image}
                        srcAlt="Course image"
                    />
                    <Card.Body>
                        <Card.Section>
                            <h2>{value.title}</h2>
                            <p>{value.id}</p>
                        </Card.Section>
                    </Card.Body>
                    <Card.Footer className="justify-content-end">
                        <Button size="sm" onClick={() => { setCreateModalData({ isOpen: true, source: value.id }) }}>Re-Run</Button>
                        <Button size="sm" as={Link} to={`/courses/${value.id}/edit`}>Edit</Button>
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
