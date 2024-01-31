import {createHash} from 'node:crypto'

const apiKey = "8e79d06ceb57b63184c07c9d5ce85b7d";
const privateKey = "6f4f380e751519bd7f0036c5ce128d52c12446a3";
const ts = new Date().getTime();



/**
 * Récupère les données de l'endpoint en utilisant les identifiants
 * particuliers developer.marvels.com
 * @param url l'end-point
 * @return {Promise<json>}
 */
export const getData = async (url) => {

    const hash = await getHash(apiKey, privateKey, ts);

    const params = new URLSearchParams({
        apikey: apiKey,
        hash: hash,
        ts: ts,
        limit: 100
    });


    const response = await fetch(`${url}?${params}`);

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const responseJson = await response.json();
    const responseResults = responseJson.data.results;
    let responseWithThumbnail = []

    responseResults.forEach((element) => {
        if(element.thumbnail.path !== 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available') {
            responseWithThumbnail.push(element);
        }
    });

    return responseWithThumbnail.map((character) => {
        const newCharacter = { ...character };
        newCharacter.imageUrl = character.thumbnail.path + "/portrait_xlarge." + character.thumbnail.extension
        return newCharacter;
    });
}

/**
 * Calcul la valeur md5 dans l'ordre : timestamp+privateKey+publicKey
 * cf documentation developer.marvels.com
 * @param publicKey
 * @param privateKey
 * @param timestamp
 * @return {Promise<ArrayBuffer>} en hexadecimal
 */
export const getHash = async (publicKey, privateKey, timestamp) => {
    const preHash = timestamp + privateKey + publicKey;
    return createHash('md5').update(preHash).digest('hex');

}