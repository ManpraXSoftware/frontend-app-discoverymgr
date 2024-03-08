import { Card } from "@edx/paragon";
import image from '../../assets/program.jpeg';
import { useHistory } from "react-router";

const CardData = ({ className, original }) => {
    const navigate = useHistory()

    return (
        <Card className="cardItem" onClick={() => { navigate.push(`/editDegree/${original.uuid}`, original) }}>
                <Card.ImageCap src={original.banner_image != null ? original.banner_image : image} srcAlt="Card image" />
                <Card.Header title={original.title} />

            </Card>
        )
}

export default CardData;