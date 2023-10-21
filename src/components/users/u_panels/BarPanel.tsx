import Twemoji from "react-twemoji";
import { useTranslation } from "react-i18next";

import { FaDiscord, FaGlobe, FaHeart, FaMapMarkedAlt, FaRegBuilding, FaTwitter, FaUsers } from "react-icons/fa";

import { User } from "../../../resources/types/user";

interface Props {
    user: User
}

const BarPanel = (p: Props) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-row flex-wrap items-center gap-4 p-4 m-0 shadow-lg bg-custom-800">
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
        </div>
    )
}
export default BarPanel;