import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Query, Delete } from '@nestjs/common';


@Controller('blog')
export class BlogController {

    constructor() { }

    // Fetch all posts
    @Get('posts')
    async getPosts(@Res() res) {
        // const posts = await this.blogService.getPosts();
        return res.status(HttpStatus.OK).json({
            test: "test"
        });
    }
}
