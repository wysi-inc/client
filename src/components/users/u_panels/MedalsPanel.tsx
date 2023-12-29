import { useEffect, useState } from "react";

import { FaMedal } from "react-icons/fa";

import fina from "../../../helpers/fina";
import MedalBadge from "../u_comp/MedalBadge";
import { User } from "../../../resources/types/user";
import { Medal, MedalCategories} from "../../../resources/types/medals";
import TitleBar from "./TitleBar";
import { useTranslation } from "react-i18next";

interface Props {
    user: User,
    className: string,
}
const MedalsPanel = (p: Props) => {

    const {t} = useTranslation();

    const medals: MedalCategories[] = useMedals();

    return (
        <div className={p.className}>
            <TitleBar title={t('user.sections.medals.title')} icon={<FaMedal />} />
            <div className="flex flex-col grow">
                {medals.map((group, index) => 
                    <div key={index} className="grow">
                        <div className="flex flex-row items-center justify-center p-2 text-center bg-custom-900">
                            <div className="text-center">
                                {group.category}:
                            </div>
                        </div>
                        <div className="flex flex-col p-3 pt-2 grow">
                            <div className="px-2 pb-1 text-center"
                                style={{ fontSize: 14, top: -8 }}>
                            </div>
                            <div className="flex flex-row flex-wrap justify-center gap-1 grow">
                                {group.medals.map((medal: Medal, i: number) => (
                                    <MedalBadge thisMedal={medal} userMedals={p.user.user_achievements}
                                        key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
    
    function useMedals() {
        const [m, setM] = useState<MedalCategories[]>([]);
        useEffect(() => {
            getM();
        }, [])
        
        async function getM() {
            try {
                const d: MedalCategories[]  = await fina.get('/medals');
                setM(d);
            } catch (err) {
                console.error(err)
            }
        }
        console.log(m)
        return m;
    }
   
}

export default MedalsPanel;


