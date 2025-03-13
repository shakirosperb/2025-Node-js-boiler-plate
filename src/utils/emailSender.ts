import axios from 'axios';
import { emailApiKey } from '@/utils/consts';

export async function emailSender(email: string) {
    try {
        const htmlData = ''
        await axios.post(`https://mail-sender.vingb.com/custom-mail/${emailApiKey}`, {
            to_email: email,
            subject: `New Email`,
            html_data: htmlData,
        })
        console.log('Email sent successfully!');
    
    } catch (error) {
        // console.log(error);
        console.log('Email errored!');
    }
}