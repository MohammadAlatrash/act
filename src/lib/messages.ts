export type MessageType = 'Success' | 'Failure' | 'Guidance' | 'Reminder';

export const getSpiritualMessage = (type: MessageType, context?: string): string => {
    switch (type) {
        case 'Success':
            return "الحمد لله الذي بنعمته تتم الصالحات.. نفع الله بك الأمة.";
        case 'Failure':
            return "لا حول ولا قوة إلا بالله.. جدد الاستعانة وابدأ من جديد.";
        case 'Reminder':
            if (context === 'Fajr') return "وقت البكور.. انطلق لعمارة الأرض مستعيناً بالله.";
            return "جدد النية.. واجعل عملك خالصاً لوجه الله.";
        case 'Guidance':
            return "استجر بالله من التيه، وعد لمركز التأثير (الأثر).";
        default:
            return "سدد الله خطاك.";
    }
};

export const getAmanatPulse = (trust: 'Time' | 'Health' | 'Mind'): string => {
    switch (trust) {
        case 'Time':
            return "الوقت أمانة.. فكيف كان حسن جوارك لهذا السكون؟";
        case 'Health':
            return "بدنك أمانة.. والراحة عبادة لإكمال الطريق.";
        case 'Mind':
            return "عقلك أمانة.. فصنه عن لغو الحديث وتيه الأفكار.";
    }
};
