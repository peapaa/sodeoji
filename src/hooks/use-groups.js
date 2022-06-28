import { useState, useEffect } from 'react';
import { arrayOfGroup } from '../services/firebase';

export default function useGroups() {
    const [groups, setGroups] = useState(null);
    
    useEffect(() => {
        async function getGroups() {
            const GroupList = await arrayOfGroup();
            setGroups(GroupList);
        }

        getGroups();
    }, []);

    return { groups };
}
