export default defineEventHandler(async (event) => {
     const secret = process.env.FREESKY_SECRET as string
     console.log(`Secret ${secret}`)
});
