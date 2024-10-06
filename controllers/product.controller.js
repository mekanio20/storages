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
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }
    
    async addProductImage(req, res) {
        try {
            const data = await productService.addProductImageService(req.body, req.files, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async addProductReview(req, res) {
        try {
            const data = await productService.addProductReviewService(req.body, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
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
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    // PUT
    async updateProduct(req, res) {
        try {
            const data = await productService.updateProductService(req.user.id, req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    // GET
    async allProduct(req, res) {
        try {
            const data = await productService.allProductService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async allCoupons(req, res) {
        try {
            const data = await productService.allCouponsService()
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async searchProduct(req, res) {
        try {
            const data = await productService.searchProductService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async offerProduct(req, res) {
        try {
            const data = await productService.offerProductService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async topSelling(req, res) {
        try {
            const data = await productService.topSellingService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async topLiked(req, res) {
        try {
            const data = await productService.topLikedService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async topRated(req, res) {
        try {
            const data = await productService.topRatedService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async fetchProduct(req, res) {
        try {
            const data = await productService.fetchProductService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async allCategory(req, res) {
        try {
            const data = await new baseService(Models.Categories).getService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async allSubcategory(req, res) {
        try {
            const data = await productService.allSubcategoryService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }
    
    async allSubcategoryFeatures(req, res) {
        try {
            const data = await productService.allSubcategoryFeaturesService(req.query.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async fetchReview(req, res) {
        try {
            const data = await productService.fetchReviewService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async allBrands(req, res) {
        try {
            const data = await new baseService(Models.Brands).getService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async productLikes(req, res) {
        try {
            const data = await productService.productLikesService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    // DELETE
    async deleteProductImage(req, res) {
        try {
            const data = await productService.deleteProductImageService(req.params.id, req.user)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async deleteProduct(req, res) {
        try {
            const data = await productService.deleteProductService(req.params.id, req.user)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }
}

module.exports = new productController()