import { UserBadge } from '../../resources/interfaces/user';
import moment from 'moment';

interface BadgePropsInterface {
    badge: UserBadge;
}

const Badge = (props: BadgePropsInterface) => {
    return (
        <div style={{ width: 86, height: 40 }} className="tooltip"
            data-tip={`${props.badge.description} - ${moment(props.badge.awarded_at).format('DD MMM YYYY')}`}>
            {props.badge.url ?
                <a href={props.badge.url} target={"_blank"} rel="noreferrer">
                    <img src={props.badge.image_url}
                        alt="badge"
                        width={86}
                        height={40}
                    />
                </a> :
                <img src={props.badge.image_url}
                    alt="badge"
                    width={86}
                    height={40}
                />}
        </div>
    )
}

export default Badge;