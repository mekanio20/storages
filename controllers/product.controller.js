const productService = require('../services/product.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')
const baseService = require('../services/base.service')

class productController {
    // POST
    async addProduct(req, res) {
        try {
            const data = await productService.addProductService(req.body, req.files, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async addProductReview(req, res) {
        try {
            const data = await productService.addProductReviewService(req.body, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async addCoupon(req, res) {
        try {
            if (!req.file) {
                let result = await Response.BadRequest('Surat gerek!', [])
                return res.json(result)
            }
            const data = await productService.addCouponService(req.body, req.file, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async addOffer(req, res) {
        try {
            const data = await productService.addOfferService(req.body, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    // GET
    async allProduct(req, res) {
        try {
            const data = await productService.allProductService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async searchProduct(req, res) {
        try {
            const data = await productService.searchProductService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async searchHistory(req, res) {
        try {
            const data = await productService.searchHistoryService(req.query, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async offerProduct(req, res) {
        try {
            const data = await productService.offerProductService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async topSelling(req, res) {
        try {
            const data = await productService.topSellingService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async topLiked(req, res) {
        try {
            const data = await productService.topLikedService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async fetchProduct(req, res) {
        try {
            const data = await productService.fetchProductService(req.params.slug)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async allCategory(req, res) {
        try {
            const data = await new baseService(Models.Categories).getService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async allSubcategory(req, res) {
        try {
            const data = await productService.allSubcategoryService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async fetchReview(req, res) {
        try {
            const data = await productService.fetchReviewService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async allBrands(req, res) {
        try {
            const data = await new baseService(Models.Brands).getService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async productLikes(req, res) {
        try {
            const data = await productService.productLikesService(req.query, req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    // DELETE
    async deleteProduct(req, res) {
        try {
            const data = await productService.deleteProductService(req.params.id, req.user)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }
}

module.exports = new productController()