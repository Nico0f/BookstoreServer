import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CustomRequest } from 'src/middleware/types';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
// const { llla } = require('../../definitivo.js')

@Injectable()
export class BooksService {
    constructor(private prisma: PrismaService,
        private cloudinary: CloudinaryService) { }
    // create(createBookDto: CreateBookDto) {
    //   return 'This action adds a new book';
    // }

    async create(createBookDto: CreateBookDto) {
        return 'This action adds a new book';
    }


    findAll() {
        // return this.prisma.book.findMany();
    }

    async getSearch({ search, pagination, type, genre, order }) {
        search = search.trim().replaceAll(' ', ' | ')
        const paginate = (Number(pagination) - 1) * 16
        const books = await this.prisma.book.findMany({
            skip: paginate,
            where: {
                title: {
                    search
                },
                authorName: {
                    search
                }
            },
            take: 16,
            select: {
                id: true,
                title: true,
                authorName: true,
                cover: true,
                rating: true,
                amountRatings: true,
                priceHardcover: true,
                pricePaperback: true,
                priceAudiobook: true,
                priceEbook: true,
            },
            orderBy: (order === 'popular'
                ? undefined
                :
                order === 'rating~'
                    ? { rating: 'desc' }
                    :
                    order === 'newest~'
                        ? { publishedDate: 'desc' }
                        :
                        order === 'priceAs'
                            ? { priceHardcover: 'asc' }
                            :
                            order === 'priceDe'
                                ? { priceHardcover: 'desc' }
                                :
                                undefined)
        })
        const length = await this.prisma.book.count({
            where: {
                title: {
                    search
                },
                authorName: {
                    search
                }
            },
        })
        console.log(length)
        return { type: 'Search', books, length }
    }

    async getDisplay({ pagination, type, genres, order }) {
        console.log(genres)
        const paginate = (Number(pagination) - 1) * 16

        if (typeof (genres) !== 'undefined') {
            let genresArray =
                genres.includes(',')
                    ?
                    genres.replaceAll('-', ' ').split(',')
                    :
                    [genres.replaceAll('-', ' ')]

            genresArray = genresArray.map((element: string) =>
                element === 'Mythology'
                    ?
                    'Folklore & Mythology'
                    :
                    element === 'Mistery'
                        ?
                        'Mystery & Crime'
                        :
                        element === 'Fantasy'
                            ?
                            'Science Fiction & Fantasy'
                            :
                            element
            )
            console.log(genresArray)
            const books = await this.prisma.bookGenre.findMany({
                skip: paginate,
                where: {
                    genre: {
                        genreName: { in: genresArray }
                    },
                    book: {
                        type
                    },
                },
                select: {
                    book: {
                        select: {
                            id: true,
                            title: true,
                            authorName: true,
                            cover: true,
                            rating: true,
                            amountRatings: true,
                            priceHardcover: true,
                            pricePaperback: true,
                            priceAudiobook: true,
                            priceEbook: true,
                        }
                    }

                },
                orderBy: {
                    book:
                        (order === 'popular'
                            ? undefined
                            :
                            order === 'rating~'
                                ? { rating: 'desc' }
                                :
                                order === 'newest~'
                                    ? { publishedDate: 'desc' }
                                    :
                                    order === 'priceAs'
                                        ? { priceHardcover: 'asc' }
                                        :
                                        order === 'priceDe'
                                            ? { priceHardcover: 'desc' }
                                            :
                                            undefined)
                },
                take: 16,

            })

            const length = await this.prisma.bookGenre.count({
                where: {
                    genre: {
                        genreName: { in: genresArray }
                    },
                    book: {
                        type
                    }
                },
            })
            // @ts-ignore
            return { type, books: books.map(e => e.book), length, genres }
        }

        const books = await this.prisma.book.findMany({
            skip: paginate,
            where: { type },
            take: 16,
            select: {
                id: true,
                title: true,
                authorName: true,
                cover: true,
                rating: true,
                amountRatings: true,
                priceHardcover: true,
                pricePaperback: true,
                priceAudiobook: true,
                priceEbook: true,
            },
            orderBy: (order === 'popular'
                ? undefined
                :
                order === 'rating~'
                    ? { rating: 'desc' }
                    :
                    order === 'newest~'
                        ? { publishedDate: 'desc' }
                        :
                        order === 'priceAs'
                            ? { priceHardcover: 'asc' }
                            :
                            order === 'priceDe'
                                ? { priceHardcover: 'desc' }
                                :
                                undefined)
        })
        const length = await this.prisma.book.count({
            where: { type }
        })
        return { type, books, length, genres }
    }

    async getNonFiction() {
        const books = await this.prisma.book.findMany({
            where: { type: 'Nonfiction' },
            take: 16,
            select: {
                id: true,
                title: true,
                authorName: true,
                cover: true,
                rating: true,
                amountRatings: true,
                priceHardcover: true,
                pricePaperback: true,
                priceAudiobook: true,
                priceEbook: true,
            },
        })
        const length = await this.prisma.book.count({
            where: { type: 'Nonfiction' }
        })
        return { data: 'Non Fiction', books, length }
    }

    async bringHomepage() {
        const bestReviews = await this.prisma.book.findMany({
            where: {
                type: { in: ['Fiction', 'Nonfiction'] },
            },
            orderBy: { rating: 'desc' },
            take: 6,
            skip: 1,
            select: {
                id: true,
                title: true,
                authorName: true,
                cover: true,
                rating: true,
                amountRatings: true,
                priceHardcover: true,
                pricePaperback: true,
                priceAudiobook: true,
                priceEbook: true,
            }
        });

        const mainDescription = await this.prisma.book.findFirst({
            where: {
                type: { in: ['Fiction', 'Nonfiction'] },
            },
            select: {
                id: true,
                title: true,
                authorName: true,
                cover: true,
                description: true,
                rating: true,
                amountRatings: true,
                priceHardcover: true,
                pricePaperback: true,
                priceAudiobook: true,
                priceEbook: true,
            },
            orderBy: {
                rating: 'desc'
            },
            take: 1
        })

        const bestSellers = await this.prisma.book.findMany({
            where: {
                type: { in: ['Fiction', 'Nonfiction'] },
            },
            take: 6,
            select: {
                id: true,
                title: true,
                authorName: true,
                cover: true,
                rating: true,
                amountRatings: true,
                priceHardcover: true,
                pricePaperback: true,
                priceAudiobook: true,
                priceEbook: true,
            }
        });
        const banner = await this.prisma.book.findFirst({
            where: {
                title: 'Spare'
            },
            select: {
                id: true,
                title: true,
                authorName: true,
                description: true,
                cover: true,
                rating: true,
                amountRatings: true,
                priceHardcover: true,
                pricePaperback: true,
                priceAudiobook: true,
                priceEbook: true
            }
        })

        return { bestReviews, bestSellers, banner, mainDescription }


    }

    findOne(id: number) {
        const book = this.prisma.book.findUnique({ where: { id } });
        return book;
    }

    async findRelated(id: number) {
        // const booksRelated = this.prisma.book.findMany({
        //     where: { genre, id: { not: id } },
        //     take: 12,
        //     select: {
        //         id: true,
        //         title: true,
        //         authorName: true,
        //         cover: true,
        //         rating: true,
        //         amountRatings: true,
        //         priceHardcover: true,
        //         pricePaperback: true,
        //         priceAudiobook: true,
        //         priceEbook: true,
        //     }
        // })
        const bookGenre = await this.prisma.bookGenre.findFirst({
            where: {
                bookId: id
            }
        })


        const booksRelated = await this.prisma.bookGenre.findMany({
            where: {
                genreId: bookGenre.genreId,
                bookId: { not: id }
            },
            take: 12,
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true,
                    }
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            }
        })
        return booksRelated.map(e => e.book)
    }

    update(id: number, updateBookDto: UpdateBookDto) {
        return `This action updates a #${id} book`;
    }

    remove(id: number) {
        return `This action removes a #${id} book`;
    }

    async getKidsPage() {

        const kidsPopular = await this.prisma.book.findMany({
            where: {
                type: 'Kids'
            },
            take: 7
        })


        const mainDescription = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Family & Growing Up'
                },
                book: {
                    type: 'Kids'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    }
                },
            },
            take: 1,
        })

        const familyBooks = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Family & Growing Up'
                },
                book: {
                    type: 'Kids'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    }
                },
            },
            skip: 2,
            take: 6,
        })

        const artBooks = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Art & Crafts'
                },
                book: {
                    type: 'Kids'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    },
                },
            },

            take: 12,
        })

        const scienceBooks = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Science & Technology'
                },
                book: {
                    type: 'Kids'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    }
                },
            },
            take: 4,
        })

        const animalBooks = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Animals'
                },
                book: {
                    type: 'Kids'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    }
                },
            },
            take: 4,
        })



        const fairyBooks = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Fairy Tales, Myths & Fables'
                },
                book: {
                    type: 'Kids'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    }
                },
            },
            take: 4,
        })
        return {
            mainDescription: mainDescription.map(e => e.book),
            kidsPopular,
            familyBooks: familyBooks.map(e => e.book),
            fairyBooks: fairyBooks.map(e => e.book),
            scienceBooks: scienceBooks.map(e => e.book),
            animalBooks: animalBooks.map(e => e.book),
            artBooks: artBooks.map(e => e.book)
        }
    }

    async newArrivalsPage() {

        const newFiction = await this.prisma.book.findMany({
            where: {
                type: 'Fiction'
            },
            orderBy: {
                publishedDate: 'desc'
            },
            select: {
                id: true,
                title: true,
                description: true,
                authorName: true,
                cover: true,
                rating: true,
                amountRatings: true,
                priceHardcover: true,
                pricePaperback: true,
                priceAudiobook: true,
                priceEbook: true
            },
            take: 4
        })

        const newNonFiction = await this.prisma.book.findMany({
            where: {
                type: 'Nonfiction'
            },
            orderBy: {
                publishedDate: 'desc'
            },
            select: {
                id: true,
                title: true,
                description: true,
                authorName: true,
                cover: true,
                rating: true,
                amountRatings: true,
                priceHardcover: true,
                pricePaperback: true,
                priceAudiobook: true,
                priceEbook: true
            },
            take: 4
        })


        // const mainDescription = await this.prisma.bookGenre.findMany({
        //     where: {
        //         genre: {
        //             genreName: 'Romance'
        //         },
        //         book: {
        //             type: 'Fiction'
        //         }
        //     },
        //     orderBy: {
        //         book: {
        //             rating: 'desc'
        //         }
        //     },
        //     select: {
        //         book: {
        //             select: {
        //                 id: true,
        //                 title: true,
        //                 description: true,
        //                 authorName: true,
        //                 cover: true,
        //                 rating: true,
        //                 amountRatings: true,
        //                 priceHardcover: true,
        //                 pricePaperback: true,
        //                 priceAudiobook: true,
        //                 priceEbook: true
        //             }
        //         },
        //     },
        //     take: 1,
        // })

        const newRomance = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Romance'
                },
                book: {
                    type: 'Fiction'
                }
            },
            orderBy: {
                book: {
                    publishedDate: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    }
                },
            },
            take: 7,
        })

        const newScienceFiction = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Science Fiction & Fantasy'
                },
                book: {
                    type: 'Fiction'
                }
            },
            orderBy: {
                book: {
                    publishedDate: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    },
                },
            },

            take: 12,
        })

        const banner = await this.prisma.book.findFirst({
            where: {
                title: 'Spare'
            },
            select: {
                id: true,
                title: true,
                authorName: true,
                description: true,
                cover: true,
                rating: true,
                amountRatings: true,
                priceHardcover: true,
                pricePaperback: true,
                priceAudiobook: true,
                priceEbook: true
            }
        })

        const banner2 = await this.prisma.book.findFirst({
            where: {
                title: 'A Long Petal of the Sea: A Novel'
            },
            select: {
                id: true,
                title: true,
                authorName: true,
                description: true,
                cover: true,
                rating: true,
                amountRatings: true,
                priceHardcover: true,
                pricePaperback: true,
                priceAudiobook: true,
                priceEbook: true
            }
        })

        return {
            // mainDescription: mainDescription.map(e => e.book),
            newFiction,
            newRomance: newRomance.map(e => e.book),
            newScienceFiction: newScienceFiction.map(e => e.book),
            newNonFiction,
            banner,
            banner2
        }
    }

    async getFictionPage() {

        const fictionPopular = await this.prisma.book.findMany({
            where: {
                type: 'Fiction'
            },
            take: 7
        })


        const mainDescription = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Romance'
                },
                book: {
                    type: 'Fiction'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    }
                },
            },
            take: 1,
        })

        const romanceBooks = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Romance'
                },
                book: {
                    type: 'Fiction'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    }
                },
            },
            skip: 1,
            take: 6,
        })

        const scienceFictionBooks = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Science Fiction & Fantasy'
                },
                book: {
                    type: 'Fiction'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    },
                },
            },

            take: 12,
        })

        const misteryBooks = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Mystery & Crime'
                },
                book: {
                    type: 'Fiction'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    }
                },
            },
            take: 4,
        })

        const thrillerBooks = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Thrillers'
                },
                book: {
                    type: 'Fiction'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    }
                },
            },
            take: 4,
        })



        const horrorBooks = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Horror'
                },
                book: {
                    type: 'Fiction'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    }
                },
            },
            take: 4,
        })
        return {
            mainDescription: mainDescription.map(e => e.book),
            fictionPopular,
            romanceBooks: romanceBooks.map(e => e.book),
            horrorBooks: horrorBooks.map(e => e.book),
            misteryBooks: misteryBooks.map(e => e.book),
            thrillerBooks: thrillerBooks.map(e => e.book),
            scienceFictionBooks: scienceFictionBooks.map(e => e.book)
        }
    }



    async getNonFictionPage() {

        const fictionPopular = await this.prisma.book.findMany({
            where: {
                type: 'Nonfiction'
            },
            take: 7
        })

        const mainDescription = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Biography'
                },
                book: {
                    type: 'Nonfiction'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    }
                },
            },
            take: 1,
        })

        const biographyBooks = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Biography'
                },
                book: {
                    type: 'Nonfiction'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    }
                },
            },
            skip: 1,
            take: 6,
        })


        const businessBooks = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Business'
                },
                book: {
                    type: 'Nonfiction'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    },
                },
            },

            take: 12,
        })


        const humorBooks = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Humor'
                },
                book: {
                    type: 'Nonfiction'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    }
                },
            },
            take: 4,
        })


        const philosophyBooks = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Philosophy'
                },
                book: {
                    type: 'Nonfiction'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    }
                },
            },
            take: 4,
        })


        const sportsBooks = await this.prisma.bookGenre.findMany({
            where: {
                genre: {
                    genreName: 'Sports'
                },
                book: {
                    type: 'Nonfiction'
                }
            },
            orderBy: {
                book: {
                    rating: 'desc'
                }
            },
            select: {
                book: {
                    select: {
                        id: true,
                        title: true,
                        authorName: true,
                        cover: true,
                        rating: true,
                        amountRatings: true,
                        priceHardcover: true,
                        pricePaperback: true,
                        priceAudiobook: true,
                        priceEbook: true
                    }
                },
            },
            take: 4,
        })
        return {
            mainDescription: mainDescription.map(e => e.book),
            fictionPopular,
            biographyBooks: biographyBooks.map(e => e.book),
            sportsBooks: sportsBooks.map(e => e.book),
            humorBooks: humorBooks.map(e => e.book),
            philosophyBooks: philosophyBooks.map(e => e.book),
            businessBooks: businessBooks.map(e => e.book)
        }
    }

    async clean() {

        // const books = llla
        const romancebooks = await this.prisma.bookGenre.findMany({
            where: {
                genreId: 31
            },
            include: {
                book: true
            }
        })
        return romancebooks
    }

    async deleteAll() {
        return await this.prisma.book.deleteMany({})
    }

    // async addAll() {
    //     const books = llla

    //     // await this.prisma.bookGenre.deleteMany()

    //     // await this.prisma.genre.deleteMany()

    //     // await this.prisma.bookAuthor.deleteMany()

    //     // await this.prisma.author.deleteMany()

    //     // return await this.prisma.book.deleteMany()

    //     const genres = []

    //     const authors = []

    //     for (const book of books) {
    //         for (const genre of book.genre) {
    //             if (!genres.includes(genre)) {
    //                 genres.push(genre)
    //                 await this.prisma.genre.create({
    //                     data: {
    //                         genreName: genre
    //                     }
    //                 })
    //             }
    //         }
    //     }

    //     for (const book of books) {
    //         if (!authors.includes(book.authorName)) {
    //             authors.push(book.authorName)
    //             await this.prisma.author.create({
    //                 data: {
    //                     name: book.authorName,
    //                     about: book.authorDescription
    //                 }
    //             })
    //         }
    //     }


    //     let i = 1
    //     for (const book of books) {
    //         console.log('Creating book n°: ', i)
    //         i++

    //         const veo = await this.prisma.book.findUnique({
    //             where: {
    //                 title: book.title
    //             }
    //         })

    //         if (!veo) {

    //             function getRandomRat(min, max) {
    //                 const rand = Math.floor(Math.random() * (max + 1 - min))
    //                 return min + rand
    //             }


    //             function getRandomPrice(max) {
    //                 return Math.floor(12 + Math.random() * max);
    //             }


    //             function getRandomInt(max) {
    //                 const rand = Math.floor(Math.random() * max)
    //                 if (rand > 10) {
    //                     return { audio: true, eb: true }
    //                     const audio = true
    //                     const eb = true
    //                 } else if (rand < 10 && rand > 5) {
    //                     return { audio: false, eb: true }
    //                     const audio = false
    //                     const eb = true
    //                 } else {
    //                     return { audio: false, eb: false }
    //                     const audio = false
    //                     const eb = false
    //                 }
    //             }


    //             function getRating(max): any {
    //                 const rand = Math.floor((Math.random() * max) + 1)
    //                 if (rand > 95) {
    //                     let five_rating = getRandomRat(50, 65)
    //                     let four_rating = getRandomRat(5, 10)
    //                     let three_rating = getRandomRat(3, 4)
    //                     let two_rating = getRandomRat(2, 4)
    //                     let one_rating = getRandomRat(0, 2)
    //                     let rating = ((five_rating * 5) + (four_rating * 4) + (three_rating * 3) + (two_rating * 2) + (one_rating)) / (five_rating + four_rating + three_rating + two_rating + one_rating)
    //                     let amount_ratings = five_rating + four_rating + three_rating + two_rating + one_rating
    //                     return {
    //                         rating: rating,
    //                         amount_ratings: amount_ratings,
    //                         five_rating: five_rating,
    //                         four_rating: four_rating,
    //                         three_rating: three_rating,
    //                         two_rating: two_rating,
    //                         one_rating: one_rating,
    //                     }
    //                 } else if (rand <= 95 && rand > 45) {
    //                     let five_rating = getRandomRat(7, 11)
    //                     let four_rating = getRandomRat(25, 35)
    //                     let three_rating = getRandomRat(6, 9)
    //                     let two_rating = getRandomRat(1, 3)
    //                     let one_rating = getRandomRat(0, 1)
    //                     let rating = ((five_rating * 5) + (four_rating * 4) + (three_rating * 3) + (two_rating * 2) + (one_rating)) / (five_rating + four_rating + three_rating + two_rating + one_rating)
    //                     let amount_ratings = five_rating + four_rating + three_rating + two_rating + one_rating
    //                     return {
    //                         rating: rating,
    //                         amount_ratings: amount_ratings,
    //                         five_rating: five_rating,
    //                         four_rating: four_rating,
    //                         three_rating: three_rating,
    //                         two_rating: two_rating,
    //                         one_rating: one_rating,
    //                     }
    //                 } else if (rand <= 45 && rand >= 25) {
    //                     let five_rating = getRandomRat(2, 3)
    //                     let four_rating = getRandomRat(10, 15)
    //                     let three_rating = getRandomRat(25, 30)
    //                     let two_rating = getRandomRat(7, 11)
    //                     let one_rating = getRandomRat(1, 3)
    //                     let rating = ((five_rating * 5) + (four_rating * 4) + (three_rating * 3) + (two_rating * 2) + (one_rating)) / (five_rating + four_rating + three_rating + two_rating + one_rating)
    //                     let amount_ratings = five_rating + four_rating + three_rating + two_rating + one_rating
    //                     return {
    //                         rating: rating,
    //                         amount_ratings: amount_ratings,
    //                         five_rating: five_rating,
    //                         four_rating: four_rating,
    //                         three_rating: three_rating,
    //                         two_rating: two_rating,
    //                         one_rating: one_rating,
    //                     }
    //                 } else if (rand < 25 && rand >= 5) {
    //                     let five_rating = getRandomRat(0, 1)
    //                     let four_rating = getRandomRat(2, 4)
    //                     let three_rating = getRandomRat(10, 15)
    //                     let two_rating = getRandomRat(27, 31)
    //                     let one_rating = getRandomRat(6, 8)
    //                     let rating = ((five_rating * 5) + (four_rating * 4) + (three_rating * 3) + (two_rating * 2) + (one_rating)) / (five_rating + four_rating + three_rating + two_rating + one_rating)
    //                     let amount_ratings = five_rating + four_rating + three_rating + two_rating + one_rating
    //                     return {
    //                         rating: rating,
    //                         amount_ratings: amount_ratings,
    //                         five_rating: five_rating,
    //                         four_rating: four_rating,
    //                         three_rating: three_rating,
    //                         two_rating: two_rating,
    //                         one_rating: one_rating,
    //                     }
    //                 } else if (rand < 5) {
    //                     let five_rating = 0
    //                     let four_rating = getRandomRat(1, 2)
    //                     let three_rating = getRandomRat(2, 3)
    //                     let two_rating = getRandomRat(10, 15)
    //                     let one_rating = getRandomRat(32, 43)
    //                     let rating = ((five_rating * 5) + (four_rating * 4) + (three_rating * 3) + (two_rating * 2) + (one_rating)) / (five_rating + four_rating + three_rating + two_rating + one_rating)
    //                     let amount_ratings = five_rating + four_rating + three_rating + two_rating + one_rating
    //                     return {
    //                         rating: rating,
    //                         amount_ratings: amount_ratings,
    //                         five_rating: five_rating,
    //                         four_rating: four_rating,
    //                         three_rating: three_rating,
    //                         two_rating: two_rating,
    //                         one_rating: one_rating,
    //                     }
    //                 } else {
    //                     return 'error'
    //                 }
    //             }

    //             let priceinit = Number(getRandomPrice(20).toFixed(1) + '0')
    //             let price2 = Number(((priceinit * 75) / 100).toFixed(1))
    //             let price3 = Number(((priceinit * 69) / 100).toFixed(1))

    //             let rats = getRating(100)

    //             //   console.log('https://'+ llla[0].cover)
    //             //   const uploadedCover = await this.cloudinary.uploadCover('https://'+ llla[0].cover)



    //             const createdBook = await this.prisma.book.create({
    //                 data: {
    //                     title: book.title,
    //                     authorName: book.authorName,
    //                     publisher: book.publisher,
    //                     publishedDate: book.publishedDate,
    //                     description: book.description,
    //                     type: book.type,
    //                     pageCount: Number(book.pageCount),
    //                     curatedReview: book.curatedReview,
    //                     isbn13: book.isbn13,
    //                     cover: book.cover,
    //                     rating: Number(rats.rating.toFixed(2)),
    //                     amountRatings: Number(rats.amount_ratings),
    //                     oneRating: Number(rats.one_rating),
    //                     twoRating: Number(rats.two_rating),
    //                     threeRating: Number(rats.three_rating),
    //                     fourRating: Number(rats.four_rating),
    //                     fiveRating: Number(rats.five_rating),
    //                     priceHardcover: priceinit,
    //                     pricePaperback: priceinit - 3,
    //                     priceEbook: price2,
    //                     priceAudiobook: price3,
    //                     bestSeller: false,
    //                     stock: 25,
    //                     onOffer: false,
    //                 }
    //             })
    //             for (const genre of book.genre) {
    //                 const genreId = await this.prisma.genre.findUnique({
    //                     where: {
    //                         genreName: genre
    //                     }
    //                 })
    //                 await this.prisma.bookGenre.create({
    //                     data: {
    //                         bookId: createdBook.id,
    //                         genreId: genreId.id
    //                     }
    //                 })
    //             }

    //             const searchAuthor = await this.prisma.author.findUnique({
    //                 where: {
    //                     name: book.authorName
    //                 }
    //             })

    //             const bookauthor = await this.prisma.bookAuthor.create({
    //                 data: {
    //                     bookId: createdBook.id,
    //                     authorId: searchAuthor.id
    //                 }
    //             })
    //         }
    //     }
    // }
}
