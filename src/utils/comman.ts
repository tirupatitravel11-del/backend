
export const getisotime = (obj: any) => {

    try {
        return obj.now().toUTC().toISO()

    } catch (error) {
        console.log(error);
    }
}

