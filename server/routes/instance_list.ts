import axios from 'axios'

async function fetchInstances() {
  console.log("Fetching  secret " + process.env.MastodonSecret)
    try {
        const response = await axios.get(
            'https://instances.social/api/1.0/instances/list',
            {
                params: {
                    count: 1000,
                    include_dead: false
                },
                headers: {
                    Authorization:  "Bearer "+process.env.MastodonSecret,
                },
            }
        )

        const instances = response.data.instances
        const urls = instances.map((i: any) => i.name)
        console.log('所有服务器 URL:', urls.length)
        return urls
    } catch (error) {
        console.error('获取实例列表失败:', error)
    }
}


export default defineEventHandler(async () => {
    const urls = await fetchInstances();
    const  success = urls? true : false;

    return {
        data: urls,
        success,
    }
})