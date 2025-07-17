import { Ionicons } from "@expo/vector-icons";

export interface SocialDataProps {
    id: string;
    icon_name: keyof typeof Ionicons.glyphMap;
    social_platform: string;
    link?: string
}

export const SocialData: SocialDataProps[] = [
    {
        id: '1',
        icon_name: 'headset-outline',
        social_platform: 'Customer Service'

    },
    {
        id: '2',
        icon_name: 'logo-whatsapp',
        social_platform: 'WhatsApp'

    },
    {
        id: '3',
        icon_name: 'browsers',
        social_platform: 'Website'

    },
    {
        id: '4',
        icon_name: 'logo-facebook',
        social_platform: 'Facebook'

    },
    {
        id: '5',
        icon_name: 'logo-twitter',
        social_platform: 'Twitter'

    },
    {
        id: '6',
        icon_name: 'logo-instagram',
        social_platform: 'Instagram'

    },

]
