import axios from 'axios'
import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'

// https://docs.github.com/en/rest/reference/users
interface UserInfo {
    login: string
    avatar_url: string
    html_url: string
    name: string
    repos_url: string
    location: string | null
    email: string | null
    bio: string | null
    twitter_username: string | null
    public_repos: number
    public_gists: number
    followers: number
    following: number
    created_at: string
    updated_at: string
    hireable: boolean
    blog: string | null
    company: string | null
    gravatar_id: string | null
}

// https://docs.github.com/en/rest/reference/repos
interface RepoInfo {
    name: string
    full_name: string
    owner: UserInfo
    description: string | null
    language: string
    stargazers_count: number
    watchers_count: number
    forks_count: number
    open_issues_count: number
    license: {
        name: string
    }
    created_at: string
    updated_at: string
}

@Command('github', {
    aliases: ['gh'],
    description: 'Get github information about a user/repo',
    category: 'coding',
    usage: `#github`,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const terms = context.trim().split('/')
        if (terms[0] === '') return void M.reply(`Arguments not found : Use #gh (username/repo | username)`)
        const username = terms[0]
        const repo = terms.length > 1 ? terms[1] : null
        let text = ''
        if (!repo) {
            const userInfo = await axios
                .get<UserInfo>(`https://api.github.com/users/${username}`)
                .then((res) => res.data)
                .catch((err) => {
                    console.log(err)
                    return void M.reply('🟥 ERROR 🟥\n Failed to fetch the User')
                })

            if (userInfo === undefined) {
                return void M.reply('🟥 ERROR 🟥\n Failed to fetch the User')
            }

            // prepare text information
            text += `🌐 *URL:* http://github.com/${username}\n`
            text += `🌟 *Username:* ${userInfo.name}\n`
            if (userInfo.email !== null) text += `📧 *Email:* ${userInfo.email}\n`
            if (userInfo.location !== null) text += `📍 *Location:* ${userInfo.location}\n`
            if (userInfo.bio !== null) text += `🚀 *Bio:* ${userInfo.bio}\n`
            text += `*👥 Followers:* ${userInfo.followers}\n💫 *Following:* ${userInfo.following}\n`
            text += `💮 *Public Repositories:* ${userInfo.public_repos}\n`
            return void M.reply(text)
        } else {
            const repoInfo = await axios
                .get<RepoInfo>(`https://api.github.com/repos/${username}/${repo}`)
                .then((res) => res.data)
                .catch((err) => {
                    console.log(err)
                    return void M.reply('🟥 ERROR 🟥\n Failed to fetch the Repo')
                })

            if (repoInfo === undefined) {
                return void M.reply('🟥 ERROR 🟥\n Failed to fetch the Repo')
            }

            // prepare text information
            text += `🌐 *URL :* http://github.com/${username}/${repo}\n`
            text += `📂 *Repository Name :* ${repoInfo.name}\n`
            text += `❄ *Description:* ${repoInfo.description ?? '-'}\n`
            text += `🎀 *License:* ${repoInfo.license.name}\n`
            text += `🌟 *Stars:* ${repoInfo.stargazers_count}\n`
            text += `🌸 *Language:* ${repoInfo.language}\n`
            text += `🍴 *Forks:* ${repoInfo.forks_count}\n`
            text += `⚠️ *Issues:* ${repoInfo.open_issues_count}\n`
            text += `📅 *Created on:* ${repoInfo.created_at}\n`
            text += `📅 *Updated on:* ${repoInfo.updated_at.slice(0, 11)}\n`

            return void M.reply(text)
        }
    }
}
