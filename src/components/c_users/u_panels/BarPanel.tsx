import { FaDiscord, FaGlobe, FaHeart, FaMapMarkedAlt, FaRegBuilding, FaTwitter, FaUsers } from "react-icons/fa";
import Twemoji from "react-twemoji";
import { User } from "../../../resources/interfaces/user";
import { useTranslation } from "react-i18next";

interface BarPanelProps {
    user: User
}

const BarPanel = (p: BarPanelProps) => {
    const {t} = useTranslation();
    return (
        <>
        <div className="flex flex-row items-center gap-2">
                <FaUsers />
                <div>{t('user.followers')}: {p.user.follower_count.toLocaleString()}</div>
            </div>
            {p.user.discord !== null &&
                <div className="flex flex-row items-center gap-2">
                    <FaDiscord />
                    {p.user.discord}
                </div>}
            {p.user.twitter !== null &&
                <div className="flex flex-row items-center gap-2">
                    <FaTwitter />
                    {p.user.twitter}
                </div>}
            {p.user.website !== null &&
                <div className="flex flex-row items-center gap-2">
                    <FaGlobe />
                    <Twemoji options={{ className: 'emoji' }}>
                        {p.user.website}
                    </Twemoji>
                </div>}
            {p.user.discord !== null &&
                <div className="flex flex-row items-center gap-2">
                    <FaMapMarkedAlt />
                    <Twemoji options={{ className: 'emoji' }}>
                        {p.user.location}
                    </Twemoji>
                </div>}
            {p.user.interests !== null &&
                <div className="flex flex-row items-center gap-2">
                    <FaHeart />
                    <Twemoji options={{ className: 'emoji' }}>
                        {p.user.interests}
                    </Twemoji>
                </div>}
            {p.user.occupation !== null &&
                <div className="flex flex-row items-center gap-2">
                    <FaRegBuilding />
                    <Twemoji options={{ className: 'emoji' }}>
                        {p.user.occupation}
                    </Twemoji>
                </div>}
        </>
    )
}
export default BarPanel;