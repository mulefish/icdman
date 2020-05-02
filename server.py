from aiohttp import web
path_to_static_folder = "staticfiles"

async def handle(request):
    name = request.match_info.get('name', "Anonymous")
    text = "H!ello, " + name
    return web.Response(text=text)



app = web.Application()
# routes.static('/prefix', path_to_static_folder)
app.add_routes([web.static('/prefix', path_to_static_folder)])
app.add_routes([web.get('/', handle),
                web.get('/{name}', handle)])

if __name__ == '__main__':
    web.run_app(app)