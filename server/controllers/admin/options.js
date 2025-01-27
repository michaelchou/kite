const models = require('../../../db/mysqldb')
const { resAdminJson } = require('../../utils/resData')
function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class Options {
  /* 创建配置项 */
  static async createOptions (ctx) {
    // 公共创建配置项
    const reqData = ctx.request.body

    try {
      if (!reqData.option_key) {
        throw new ErrorMessage('请输入键名!')
      }

      if (!reqData.option_value) {
        throw new ErrorMessage('请输入值!')
      }

      await models.options.create({
        option_key: reqData.option_key, // 键名
        option_value: reqData.option_value //  值
      })
      resAdminJson(ctx, {
        state: 'success',
        message: '配置创建成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 查询配置项
   * @param   {object} ctx 上下文对象
   */
  static async QueryOptions (ctx) {
    const reqData = ctx.query
    try {
      const optionsAll = await models.options.findAll({
        where: {
          ...reqData // 查询条件
        }
      })
      if (optionsAll) {
        resAdminJson(ctx, {
          state: 'success',
          message: '获取配置项成功',
          data: optionsAll
        })
      } else {
        resAdminJson(ctx, {
          state: 'error',
          message: '配置项为空'
        })
      }
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 更新配置项
   * @param   {object} ctx 上下文对象
   */
  static async updateOptions (ctx) {
    const reqData = ctx.request.body
    try {
      if (!reqData.option_key) {
        throw new ErrorMessage('请输入键名!')
      }

      if (!reqData.option_value) {
        throw new ErrorMessage('请输入值!')
      }

      await await models.options.update(
        {
          option_value: reqData.option_value
        },
        {
          where: {
            option_id: reqData.option_id // 查询条件
          }
        }
      )
      resAdminJson(ctx, {
        state: 'success',
        message: '更新配置项成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 删除配置项
   */
  static async deleteOptions (ctx) {
    const { option_id } = ctx.request.body
    try {
      let oneOptions = await models.options.findOne({ where: { option_id } })
      if (!oneOptions) {
        throw new ErrorMessage('删除项不存在!')
      }
      await models.options.destroy({ where: { option_id } })
      resAdminJson(ctx, {
        state: 'success',
        message: '删除配置项成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

module.exports = Options
